const ts = require('typescript');

module.exports = function(sourceFile) {
    const printer = ts.createPrinter({
        newLine: ts.NewLineKind.LineFeed
    });

    return printer.printFile(sourceFile);
};