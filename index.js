require('dotenv').config();
const { Client, IntentsBitField, Partials, Collection } = require('discord.js');
const eventHandler = require('./src/handlers/eventHandler');
// const keepalive = require('./alive');

//npx nodemon

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent
    ],
    partials: [
        Partials.Channel
    ]
});

eventHandler(client);

client.login(process.env.TOKEN).catch((error) => {
    console.error('Failed to login to Discord:', error);
});
