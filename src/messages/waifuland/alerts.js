require('dotenv').config();
const axios = require('axios');
const { EmbedBuilder } = require('discord.js');

const subreddits = ['AdorableNudes', 'AmateurPorn', 'AsianPorn', 'asshole', 'BangladeshGoneSexy', 'celebsnaked', 'collegesluts', 'Dark_nipples', 'DaughterTraining', 'DesiStree', 'gonewild', 'IndianOwnedWomen', 'LegalTeens', 'LesbianFantasy', 'needysluts', 'onlyfansgirls101', 'YoungGirlsGoneWild'];

async function getRedditAccessToken() {
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
                }
            }
        );
        return res.data.access_token;
    } catch (err) {
        console.error('Error fetching Reddit access token:', err.response?.data || err.message);
        throw new Error('Failed to get Reddit access token');
    }
}

module.exports = async (client, message) => {
    if (message.channel.id !== '924703419380400188') return;
    if (message.author.id !== process.env.ALLOWED_USER_ID) return;
    if (!message.content.includes('qweasd')) return;
    await message.delete();

    let accessToken;
    try {
        accessToken = await getRedditAccessToken();
    } catch (err) {
        return message.channel.send('Failed to authenticate.');
    }

    for (const sub of subreddits) {
        try {
            const res = await axios.get(`https://oauth.reddit.com/r/${sub}/top`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'User-Agent': process.env.REDDIT_USER_AGENT
                },
                params: {
                    limit: 10,
                    t: 'week'
                }
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
                    .setFooter({ text: `NSFW` })
                    .setTimestamp();

                await message.channel.send({ embeds: [embed] });
            }

        } catch (err) {
            console.error(`Failed to fetch subreddit /r/${sub}:`, err.response?.data || err.message);
        }
    }
};
