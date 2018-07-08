const ts = require('typescript');
const kind = ts.SyntaxKind;

module.exports = function(ast) {
    const classes = ast.statements.filter(x=>x.kind === kind.ClassDeclaration);
    if(classes && classes.length > 1) {
        return classes[1];
    }
    return undefined;
};