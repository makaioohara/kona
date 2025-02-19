require('dotenv').config();
const { Client, IntentsBitField, REST, Routes } = require('discord.js');
const { TOKEN, CLIENT_ID } = process.env;

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

const commands = [
    {
        name: 'hello',
        description: 'Replies with a hello message!',
    },
];

const rest = new REST({ version: '10' }).setToken(TOKEN);

async function registerCommands() {
    try {
        console.log('Started refreshing global (/) commands.');

        await rest.put(
            Routes.applicationCommands(CLIENT_ID),
            { body: commands },
        );

        console.log('Successfully reloaded global (/) commands.');
    } catch (error) {
        console.error('Error registering commands:', error);
    }
}

registerCommands();

client.on('ready', (c) => {
    console.log(`${c.user.username} is online!`);
    client.user.setPresence({
        status: 'idle',
        activities: [{
            name: 'with waifus!',
        }],
    });
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName } = interaction;

    if (commandName === 'hello') {
        await interaction.reply('Hello, world!');
    }
});

client.on('error', (error) => {
    console.error('Bot encountered an error:', error);
});

client.login(TOKEN).catch((error) => {
    console.error('Failed to login to Discord:', error);
});
