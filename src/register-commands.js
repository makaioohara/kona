require('dotenv').config();
const { REST, Routes, ApplicationCommandOptionType } = require('discord.js');

const commands = [
    {
        name: 'bump',
        description: 'Replies with a server bump links!',
    },
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

async function registerCommands() {
    try {
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID), 
            { body: commands }
        );
        console.log('Successfully reloaded global (/) commands.');
    } catch (error) {
        console.error('Error registering commands:', error);
    }
} registerCommands();