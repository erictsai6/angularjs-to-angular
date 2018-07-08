const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');
const encoding = 'UTF-8';

module.exports = function (templateName, data) {
    if (!templateName.endsWith('.hbs')) {
        templateName += '.hbs';
    }
    const templateFile = fs.readFileSync(path.join(__dirname, '../templates', templateName), encoding);
    const template = handlebars.compile(templateFile, { encoding: 'UTF-8' });

    return template(data);
};