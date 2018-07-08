const { readFileSync, existsSync } = require('fs');
const path = require('path');

module.exports = function (file) {
    const text = readFileSync(file, 'UTF-8');

    if (/templateUrl:/.test(text)) {
        const templateFile = /templateUrl: '(.*)'/.exec(text)[1];
        const templatePath = path.join(process.cwd(), path.dirname(file), templateFile);
        if (existsSync(templatePath)) {
            return readFileSync(templatePath, 'UTF-8');
        }
    }
    else if (/template:/.test(text)) {
        return /template: `(.|\n)*`/m.exec(text);
    }
    return '';
};