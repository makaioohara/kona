require('dotenv').config();
const randomMessages = [
    "**Did u know?** The top users on the leaderboard get the @Server Expert role and can use external emojis, stickers, and sounds as long as they hold the top position!",
    "**Did u know?** Verified female users in the server receive the '@Baddie The Best Waifu' role to stand out and be recognized, with a unique color above regular users!",
    "**Did u know?** When you boost, you get a 20% rank-up boost, helping you earn XP faster and level up in no time!",
    "**Did u know?** At server level 10, you unlock the ability to use any sound on the soundboard and set your voice channel status!",
    "**Did u know?** Reaching Level 20 lets you change your nickname anytime, giving you the flexibility in how you're known in the server!",
    "**Did u know?** You can join a VC and get the @I'm in vc role, allowing you to add reactions anywhere in the chat and stand out from regular users!",
    "**Did u know?** Subscribing to our server premium gives you a @Millionaire role, almost all exclusive perks, and access to custom roles!",
    "**Did u know?** You can create polls, send voice messages, and more when you boost or subscribe to our server premium!",
    "Remember to always be respectful in the server! Treat others with kindness and follow the community guidelines to keep our space friendly and welcoming.",
    "Please be mindful of the language you use. We want to maintain a positive atmosphere for everyone—let's avoid anything harmful or inappropriate.",
    "If you're joining a voice chat, be considerate of others. Keep background noise to a minimum and avoid talking over others to ensure smooth conversations.",
    "Before sharing any content, be sure it aligns with the server's guidelines. We want to create a space where everyone feels comfortable and safe!",
    "Take a moment to familiarize yourself with the server channels and feel free to ask any questions. We're here to help you settle in!"
];

module.exports = async (client) => {
    const sendRandomMessage = async () => {
        const randomMessage = randomMessages[Math.floor(Math.random() * randomMessages.length)];
        if (!randomMessage) {
            console.error('Random message is empty.');
            return;
        }

        try {
            const channel = await client.channels.fetch(process.env.SUGGESTION_CHANNEL_ID);
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

    setInterval(sendRandomMessage, 1000000);
};