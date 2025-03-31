module.exports = async (client) => {
    console.log(`${client.user.username} is online!`);
    
    client.user.setPresence({
        status: 'idle',
        activities: [{ name: 'with husbando!' }],
    });
};
