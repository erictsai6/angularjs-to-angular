const path = require('path');
const config = require('../config');
const tmpPath = path.join(process.cwd(), config.outputRoot);
const updateReferences = require('../lib/update-references');
const processStringReplacements = require('../lib/process-string-replacements');
const getOutputFilePath = require('../lib/get-output-file-path');
const { printString } = require('../lib/pretty-print');
const readFile = require('../lib/read-file');
const writeFile = require('../lib/write-file');
const buildSpecs = require('../lib/build-specs');
const getNamedImports = require('../lib/get-named-imports');
const getSourceFile = require('../lib/get-source-file');
const renderTemplate = require('../lib/render-template');

module.exports = function(files) {

    files.forEach(file => {

        //console.log(`Processing: ${path.basename(file)}`);

        let code;

        //Model and vdom tests stand on their own so we don't comment out their code
        if (!/model|vdom/.test(file)) {
            const ast = getSourceFile(file);
            const namedImports = getNamedImports(ast);
            const specs = buildSpecs(file);

            code = renderTemplate('service-test', {
                testName: 'test',
                imports: namedImports,
                specs
            });
        }
        else {
            code = readFile(file);
            // Try and clean up the formatting some
            // Have to replace constructor with constructxr as a hack prior to running prettier
            code = code.replace(/constructor/g, 'constructxr');
            code = printString(code);
            // Now change it back
            code = code.replace(/constructxr/g, 'constructor');
        }

        // Do a bunch of string replacements
        code = processStringReplacements(code);

        // Update the references
        code = updateReferences(code);

        // Write it out
        let outputFilePath = getOutputFilePath(file);
        outputFilePath = outputFilePath.replace('-spec', '.spec');
        writeFile(outputFilePath, code);

        console.log(`${outputFilePath.replace(process.cwd(), '')}`);
    });

    console.log(`Converted ${files.length} models/services specs in ${tmpPath.replace(process.cwd() + '/', '')}.\n\n`);
};