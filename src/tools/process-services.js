const path = require('path');
const config = require('../config');
const tmpPath = path.join(process.cwd(), config.outputRoot);
const getSourceFile = require('../lib/get-source-file');
const remove$Injects = require('../lib/remove-$injects');
const removeImports = require('../lib/remove-imports');
const removeFromConstructor = require('../lib/remove-from-constructor');

const renderSourceFile = require('../lib/render-source-file');
const processStringReplacements = require('../lib/process-string-replacements');
const updateReferences = require('../lib/update-references');
const serviceImports = require('../lib/services/service-imports');
const serviceHttp = require('../lib/services/service-http');
const getOutputFilePath = require('../lib/get-output-file-path');
const { printString } = require('../lib/pretty-print');
const writeFile = require('../lib/write-file');

module.exports = function(files) {

    files.forEach(file => {

        console.log(`Processing: ${path.basename(file)}`);

        // Read and parse the file's code
        let ast = getSourceFile(file);

        // Let do some stuff before we start modifying the AST
        const imports = serviceImports.get(ast);


        // Now we are modifying the AST

        // Remove all the $injects
        ast = remove$Injects(ast);

        // Remove the existing imports
        ast = removeImports(ast);

        // Remove $q, $timeout and $interval from the constructor
        ast = removeFromConstructor(ast, ['$q', '$timeout', '$interval']);



        // Render the ast back to typescript
        let code = renderSourceFile(ast);

        // Combine the code and new imports
        code = `${imports}${'\n'}${code}`;

        // Add @Injectable()
        code = code.replace(/export (abstract )?class/g, '@Injectable()\nexport $1class');

        // Do a bunch of string replacements
        code = processStringReplacements(code);

        // Update the references
        code = updateReferences(code);

        // Try and clean up the formatting some
        code = printString(code);

        // Write it out
        const outputFilePath = getOutputFilePath(file);
        writeFile(outputFilePath, code);

        console.log(`    Created: ${path.basename(outputFilePath)}\n`);
    });

    console.log(`Converted ${files.length} models/services in ${tmpPath.replace(process.cwd() + '/', '')}.\n\n`);
};