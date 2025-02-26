require('dotenv').config();
const path = require('path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const { Collection } = require('discord.js');
const reusable = require('../../utils/reusable');

module.exports = async (client) => {
    // Function to clear commands
    const clearCommands = async (client, guildId) => {
        try {
            const guild = await client.guilds.fetch(guildId);
            await guild.commands.set([]);
            console.log('Successfully cleared guild commands!');
        } catch (error) {
            console.error('Error clearing commands:', error);
        }
    };

    await clearCommands(client, '793063389462134787');

    if (!client.commands) {
        client.commands = new Collection();
    }

    const commands = [];
    const commandFolders = reusable(path.join(__dirname, '..', '..', 'commands'), true);

    for (const folder of commandFolders) {
        const commandFiles = reusable(folder);
        for (const file of commandFiles) {
            const command = require(file);
            if (command.name && command.description) {
                commands.push({ name: command.name, description: command.description });
                client.commands.set(command.name, command);
            } else {
                console.warn(`Skipping ${file}: Missing details!`);
            }
        }
    }

    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

    try {
        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commands }
        );
        console.log('Successfully registered application commands!');
    } catch (error) {
        console.error('Error registering application commands:', error);
    }
};