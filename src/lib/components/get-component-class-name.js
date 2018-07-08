const ts = require('typescript');
const kind = ts.SyntaxKind;

module.exports = function(ast) {
    const classes = ast.statements.filter(x => x.kind === kind.ClassDeclaration);
    const componentClass = classes[0];

    let name = componentClass.name.text;
    if (name.indexOf('Component') === -1) {
        name += 'Component';
    }

    return name;
};