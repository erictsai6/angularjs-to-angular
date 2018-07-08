const ts = require('typescript');
const kind = ts.SyntaxKind;

module.exports = function(ast) {
    ast.statements = ast.statements.filter(x => x.kind !== kind.ImportDeclaration);
    return ast;
};