module.exports = async (client, message) => {
    if (message.author.bot) return;

    if (message.content.toLowerCase().includes('ping')) {
        try {
            await message.delete();
            message.channel.send("pong");
        } catch (err) {
            console.log(`Error processing message: ${err}`);
        }
    }
};
