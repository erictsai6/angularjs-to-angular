const ts = require('typescript');
const path = require('path');
const config = require('../config');
const writeFile = require('../lib/write-file');
const makeDirectoriesInPath = require('../lib/make-directories-in-path');
const sortBy = require('lodash.sortby');
const getOutputFilePath = require('../lib/get-output-file-path');
const tmpPath = path.join(process.cwd(), config.outputRoot);
const { readFileSync } = require('fs');

module.exports = function (files) {

    sortBy(files).forEach(file => {

        //console.log(`Processing: ${path.basename(file)}.`);
        const contents = readFileSync(file).toString();

        // Write it out
        const outputFilePath = getOutputFilePath(file);
        makeDirectoriesInPath(outputFilePath);
        writeFile(outputFilePath, contents);

        console.log(`${outputFilePath.replace(process.cwd(), '')}`);
    });

    console.log(`Copied ${files.length} files in ${tmpPath.replace(process.cwd() + '/', '')}.\n\n`);
};