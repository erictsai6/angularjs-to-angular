const ts = require('typescript');
const kind = ts.SyntaxKind;
module.exports = function (ast) {
    let results = [];

    ast.statements.filter(x => x.kind === kind.ImportDeclaration).forEach(i => {
        let importText = ast.text.slice(i.pos, i.end);

        // There is a new line that needs to be trimmed off
        results.push(importText.trim());
    });

    return results;
};