const fs = require('fs');
const path = require('path');
const encoding = 'UTF-8';
const makeDirectoriesInPath = require('../lib/make-directories-in-path');
const getOutputFilePath = require('../lib/get-output-file-path');
const processTemplate = require('../lib/process-template');
const tmpPath = path.join(process.cwd(), './upgrade');

module.exports = function (files) {

    files.forEach(file => {
        console.log(`Processing: ${path.basename(file)}`);

        const template = fs.readFileSync(file, encoding);
        const outputTemplatePath = getOutputFilePath(file);
        makeDirectoriesInPath(outputTemplatePath);
        fs.writeFileSync(outputTemplatePath, processTemplate(template), encoding);

        console.log(`    Processed: ${path.basename(outputTemplatePath)}`);
    });

    console.log(`Processed ${files.length} templates in ${tmpPath.replace(process.cwd() + '/', '')}.\n\n`);
};