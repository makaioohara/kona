require('dotenv').config();
const { Client, IntentsBitField, EmbedBuilder } = require('discord.js');
const keepalive = require('../keepalive');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    if (interaction.commandName === 'bump') {
        await interaction.reply('6h https://discord.me/dashboard\n12h https://discordservers.com/bump/793063389462134787\n6h https://discords.com/servers/793063389462134787/upvote\n12h https://discordbotlist.com/servers/waifuland-bangladesh/upvote');
    }
});

let commandsDeleted = false;

client.on('ready', async () => {
    console.log(`${client.user.username} is online!`);
    client.user.setPresence({
        status: 'idle',
        activities: [{ name: 'with husbando!' }],
    });

    try {
        const guild = await client.guilds.fetch('793063389462134787');
        
        if (!commandsDeleted) {
            await guild.commands.set([]);
            console.log('Successfully set guild commands to empty.');
            commandsDeleted = true;
        } else {
            console.log('Commands have already been deleted.');
        }
    } catch (error) {
        console.error('Error setting guild commands:', error);
    }
});

client.on('error', (error) => {
    console.error('Bot encountered an error:', error);
});

client.login(process.env.TOKEN).catch((error) => {
    console.error('Failed to login to Discord:', error);
});