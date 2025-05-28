require('dotenv').config();
const axios = require('axios');
const { EmbedBuilder } = require('discord.js');

const subreddits = ['Bangladesh'];

const getRedditAccessToken = async () => {
    const credentials = Buffer.from(`${process.env.REDDIT_CLIENT_ID}:${process.env.REDDIT_CLIENT_SECRET}`).toString('base64');

    try {
        const res = await axios.post(
            'https://www.reddit.com/api/v1/access_token',
            'grant_type=client_credentials',
            {
                headers: {
                    'Authorization': `Basic ${credentials}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'User-Agent': process.env.REDDIT_USER_AGENT
                },
                timeout: 5000
            }
        );
        return res.data.access_token;
    } catch (err) {
        const reason = err.response?.data?.error_description || err.message;
        console.error('Reddit token error:', err.response?.data || err.message);
        throw new Error(`Reddit authentication failed: ${reason}`);
    }
};

const fetchWithRetry = async (url, options, retries = 3) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            return await axios.get(url, options);
        } catch (err) {
            const isLastAttempt = attempt === retries;
            console.warn(`Attempt ${attempt} failed: ${err.message}`);
            if (isLastAttempt) throw err;
            await new Promise(res => setTimeout(res, 1000 * attempt));
        }
    }
};

module.exports = async (client, message) => {
    if (message.channel.id !== '1371485349557309511') return;
    if (message.author.id !== '924703419380400188') return;
    if (!message.content.includes('autobot')) return;

    await message.delete();

    let accessToken;
    try {
        accessToken = await getRedditAccessToken();
    } catch (err) {
        return message.channel.send(`${err.message}`);
    }

    const failedSubs = [];

    for (const sub of subreddits) {
        try {
            const res = await fetchWithRetry(`https://oauth.reddit.com/r/${sub}/top`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'User-Agent': process.env.REDDIT_USER_AGENT
                },
                params: {
                    limit: 10,
                    t: 'week'
                },
                timeout: 7000
            });

            const posts = res.data.data.children
                .map(p => p.data)
                .filter(p => {
                    const isImage = p.post_hint === 'image' || /\.(jpe?g|png)$/i.test(p.url);
                    const isGif = /\.(gif|gifv)$/i.test(p.url) || p.post_hint === 'hosted:video';
                    return isImage || isGif;
                })
                .sort((a, b) => {
                    const isGifA = /\.(gif|gifv)$/i.test(a.url) || a.post_hint === 'hosted:video';
                    const isGifB = /\.(gif|gifv)$/i.test(b.url) || b.post_hint === 'hosted:video';
                    if (isGifA && !isGifB) return -1;
                    if (!isGifA && isGifB) return 1;
                    return b.ups - a.ups;
                })
                .slice(0, 5);

            for (const post of posts) {
                const embed = new EmbedBuilder()
                    .setColor(0x000000)
                    .setAuthor({ name: `u/${post.author}` })
                    .setTitle(post.title || 'Reddit Post')
                    .setURL(`https://reddit.com${post.permalink}`)
                    .setImage(post.url)
                    .setDescription(post.selftext?.substring(0, 2048) || `[Link to Reddit post](https://reddit.com${post.permalink})`)
                    .setFooter({ text: post.over_18 ? 'NSFW' : 'SFW' })
                    .setTimestamp();

                await message.channel.send({ embeds: [embed] });

                const randomDelay = Math.floor(Math.random() * (3000 - 1000 + 1)) + 1000;
                await new Promise(resolve => setTimeout(resolve, randomDelay));
            }
        } catch (err) {
            failedSubs.push(sub);
            const status = err.response?.status;
            const redditError = err.response?.data?.message || err.message;

            console.error(`Error fetching /r/${sub} (${status || 'No Status'}):`, redditError);
        }
    }

    if (failedSubs.length > 0) {
        await message.channel.send(`Failed to fetch posts from: ${failedSubs.map(s => `**r/${s}**`).join(', ')}`);
    }
};
