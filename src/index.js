const { Client, IntentsBitField } = require('discord.js');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

client.on('ready', (c) => {
    console.log(`${c.user.username} is online!`);
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    if (message.content.toLowerCase().includes('peakall')) {
        try {
            await message.delete();

            const urlRegex = /(https?:\/\/[^\s]+)/g;
            const foundLinks = message.content.match(urlRegex);

            const attachments = message.attachments.map(att => att.url);

            const targetChannel = await client.channels.fetch('1341118613528252426');

            if (foundLinks && foundLinks.length > 0) {
                await targetChannel.send(`||${foundLinks[0]}||`);
            }

            if (attachments.length > 0) {
                for (const attachment of attachments) {
                    await targetChannel.send(attachment);
                }
            }

        } catch (error) {
            console.error('Error while deleting or replying:', error);
        }
    }
});

client.login(
    'MTM0MTA5ODk2OTc3Nzk2NzI0NQ.GI6pDY.kgnEW3UJzD5ML6LnwA9N7oOY9f4mJrTofRw81g'
);