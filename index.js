require('dotenv').config();
const { Client, IntentsBitField, REST, Routes } = require('discord.js');
const alive = require('./alive.js');
const { TOKEN, CLIENT_ID } = process.env;

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

client.on('ready', async () => {
    console.log(`${client.user.username} is online!`);
    client.user.setPresence({
        status: 'idle',
        activities: [{ name: 'with husbando!' }],
    });

    // try {
    //     const guild = await client.guilds.fetch('793063389462134787');
    //     await guild.commands.set([]);
    //     console.log('Successfully set guild commands to empty.');
    // } catch (error) {
    //     console.error('Error setting guild commands:', error);
    // }
});

const commands = [
    {
        name: 'bump',
        description: 'Replies with a server bump links!',
    },
];

const rest = new REST({ version: '10' }).setToken(TOKEN);

async function registerCommands() {
    try {
        await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
        console.log('Successfully reloaded global (/) commands.');
    } catch (error) {
        console.error('Error registering commands:', error);
    }
}

registerCommands();

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'bump') {
        await interaction.reply('https://discord.me/dashboard\nhttps://discordservers.com/bump/793063389462134787\nhttps://discords.com/servers/793063389462134787/upvote\nhttps://discordbotlist.com/servers/waifuland-bangladesh/upvote');
    }
});

client.on('error', (error) => {
    console.error('Bot encountered an error:', error);
});

client.login(TOKEN).catch((error) => {
    console.error('Failed to login to Discord:', error);
});

// nodemon