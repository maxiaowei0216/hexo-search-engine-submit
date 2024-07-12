const fs = require('fs');
const path = require('path');


function readUrls(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        const urls = data.split('\n').map(line => line.trim()).filter(line => line);

        return urls;
    } catch (err) {
        console.error('Error reading file:', err);
    }
}


module.exports = {
    readUrls
}