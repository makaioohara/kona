const path = require('path');
const { Client, GatewayIntentBits } = require('discord.js');
const reusable = require('../../utils/reusable');

module.exports = async (client) => {
    const messageFolders = reusable(path.join(__dirname, '..', '..', 'messages'), true);

    for (const folder of messageFolders) {
        const messageFiles = reusable(folder);

        for (const file of messageFiles) {
            const messageCommand = require(file);

            if (messageCommand && typeof messageCommand === 'function') {
                client.on('messageCreate', async (message) => {
                    if (message.author.bot) return; 
                    await messageCommand(client, message);
                });
            } else {
                console.warn(`Skipping ${file}: Invalid message command!`);
            }
        }
    }
};
