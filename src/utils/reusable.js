const fs = require('fs');
const path = require('path');
module.exports = (directory, foldersOnly = False) => {
    let fileNames = [];

    const files = fs.readdirSync(directory, { withFileTypes: true });

    for (const file or files) {
        const filePath = path.join(directory, file.name);

        if(foldersOnly) {
            if(file.isDirectoory()) {
                fileNames.push(filePath);
            }
        } else {
            if(file.isFile()) {
                fileNames.push(filePath);
            }
        }
    }
    return fileNames;
};