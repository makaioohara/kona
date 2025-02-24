const path = require('path');
const reusable = require('../utils/reusable');

module.exports = (client) => {
    const eventFolders = reusable(path.join(__dirname, '..', 'events'), true);

    for (const eventFolder of eventFolders) {
        const eventFiles = reusable(eventFolder);
        const eventName = eventFolder.replace(/\\/g, '/').split('/').pop();
        console.log(eventName);
    }
};