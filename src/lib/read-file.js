const { readFileSync, existsSync } = require('fs');

module.exports = function (file) {
    if (!existsSync(file)) {
        throw new Error(`${file} does not exist.`);
    }
    return readFileSync(file, 'UTF-8');
};