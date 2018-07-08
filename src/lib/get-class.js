const ts = require('typescript');
const kind = ts.SyntaxKind;

module.exports = function(ast) {
    const classes = ast.statements.filter(x=>x.kind === kind.ClassDeclaration 
        && x.modifiers && x.modifiers.find(y=>y.kind === kind.ExportKeyword));

    if(classes && classes.length > 0) {
        return classes[0];
    }
    return undefined;
};