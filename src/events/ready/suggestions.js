const channelId = '877040534965862450';
const randomMessages = [
    "**Did u know?** The top users on the leaderboard gets the @Server Expert role and can use external emojis, stickers, and sounds!",
    "**Did u know?** Verified female users in the server receive the '@Baddie The Best Waifu' role to stand out and be recognized!",
    "**Did u know?** When you boost, you get a 25% rank-up boost, helping you earn XP faster and level up in no time!",
    "**Did u know?** At server level 10, you unlock the ability to use any sound on the soundboard, bringing even more fun to vc activities!",
    "**Did u know?** Reaching Level 20 lets you change your nickname anytime, giving you the flexibility in how you're known in the server!",
    "**Did u know?** We have a NSFW channel and u can get access to it just by taking the NSFW role! I'm not gonna tell u how top get this role, silly!",
    "**Did u know?** You can come play minigames with others and make new friends here in this server!",
    "**Did u know?** You now have to join a vc to be able to react to text messages! Don't want the hassle? Boost our server then!"
];

module.exports = async (client) => {
    const sendRandomMessage = async () => {
        const randomMessage = randomMessages[Math.floor(Math.random() * randomMessages.length)];
        if (!randomMessage) {
            console.error('Random message is empty.');
            return;
        }

        try {
            const channel = await client.channels.fetch(channelId);
            if (channel) {
                const sentMessage = await channel.send(randomMessage);
                setTimeout(() => {
                    sentMessage.delete()
                        .catch(err => console.error('Error deleting message:', err));
                }, 120000); // 2 minutes
            }
        } catch (err) {
            console.error('Error sending message:', err);
        }
    };

    sendRandomMessage();

    setInterval(sendRandomMessage, 900000);
};
