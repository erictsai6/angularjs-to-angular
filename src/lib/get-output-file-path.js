const path = require('path');
const config = require('../config');

module.exports = function (filePath) {
    let outputFileName = path.join(config.outputRoot, filePath.replace(process.cwd(), ''));
    if (/src\/(data|img)/.test(outputFileName)) {
        outputFileName = outputFileName.replace('src', 'src/assets');
    }
    return outputFileName;
};