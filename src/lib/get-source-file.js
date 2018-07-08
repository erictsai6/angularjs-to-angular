const { readFileSync } = require('fs');
const ts = require('typescript');

module.exports = function (file) {
    const sourceFile = ts.createSourceFile(file, readFileSync(file).toString(), ts.ScriptTarget.TS, true);
    return sourceFile;
};