const path = require('path');
const reusable = require('../utils/reusable');

module.exports = (client) => {
    const eventFolders = reusable(path.join(__dirname, '..', 'events'), true);

    console.log(eventFolders);
};