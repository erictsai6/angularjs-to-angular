const { writeFileSync } = require('fs');
const makeDirectoriesInPath = require('./make-directories-in-path');

module.exports = function (path, text) {
    makeDirectoriesInPath(path);
    writeFileSync(path, text, { encoding: 'UTF-8' });
};