const ts = require('typescript');
const kind = ts.SyntaxKind;

module.exports = function(ast) {
    return ast.statements.filter(x => x.kind === kind.InterfaceDeclaration);
};