module.exports = async (client, message) => {
    if (message.author.bot) return;

    const emojiRegex = /\?:([a-zA-Z0-9_]+):/g;
    const matches = [...message.content.matchAll(emojiRegex)];

    if (matches.length === 0) return;

    await message.delete();

    try {
        const applicationEmojis = await client.application.emojis.fetch();
        let emojiMessage = "";

        matches.forEach(match => {
            const emojiName = match[1];
            const emoji = applicationEmojis.find(e => e.name === emojiName);

            if (emoji) {
                emojiMessage += `${emoji.toString()} `;
            }
        });

        if (emojiMessage) {
            message.channel.send(emojiMessage.trim());
        }
    } catch (error) {
        console.log(`Error processing message: ${error}`);
    }
};
