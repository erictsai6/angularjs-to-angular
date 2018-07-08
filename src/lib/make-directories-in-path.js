const fs = require('fs');
const path = require('path');

module.exports = function make(filePath) {
    const dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
        return true;
    }
    make(dirname);
    fs.mkdirSync(dirname);
};