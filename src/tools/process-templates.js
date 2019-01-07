const fs = require('fs');
const path = require('path');
const encoding = 'UTF-8';
const makeDirectoriesInPath = require('../lib/make-directories-in-path');
const getOutputFilePath = require('../lib/get-output-file-path');
const processTemplate = require('../lib/process-template');
const getSourceFile = require('../lib/get-source-file');
const getBindings = require('../lib/components/get-bindings');
const tmpPath = path.join(process.cwd(), './upgrade');

module.exports = function(templateFiles, componentFiles) {
    /**
     * key is tag selector
     * value is {
     *  inputs: [],
     *  outputs: [],
     *  both: []
     * }
     */
    const componentDict = {};

    (componentFiles || []).forEach(file => {
        // Estimation based on the filename - assumed consistent
        const componentKey = path.basename(file).replace(/\.component\.ts/, '');

        const componentBindings = {
            input: [],
            output: [],
            'two-way': [],
        };
        const ast = getSourceFile(file);
        const bindings = getBindings(ast);
        for (let binding of bindings) {
            componentBindings[binding.type].push(binding.name);
        }
        componentDict[componentKey] = componentBindings;
    });

    templateFiles.forEach(file => {
        console.log(`Processing: ${path.basename(file)}`);

        const template = fs.readFileSync(file, encoding);
        const outputTemplatePath = getOutputFilePath(file);
        makeDirectoriesInPath(outputTemplatePath);
        fs.writeFileSync(
            outputTemplatePath,
            processTemplate(template, componentDict),
            encoding
        );

        console.log(`    Processed: ${path.basename(outputTemplatePath)}`);
    });

    console.log(
        `Processed ${templateFiles.length} templates in ${tmpPath.replace(
            process.cwd() + '/',
            ''
        )}.\n\n`
    );
};
