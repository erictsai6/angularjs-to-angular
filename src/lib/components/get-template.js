const ts = require('typescript');
const kind = ts.SyntaxKind;

module.exports = function (ast) {
    let result = '';
    const classes = ast.statements.filter(x => x.kind === kind.ClassDeclaration);
    const componentClass = classes[0];
    let templateProperty;

    const constructor = componentClass.members.find(x => x.kind === kind.Constructor);
    if (constructor) {
        templateProperty = constructor.body.statements.find(x => x.expression && x.expression.left && x.expression.left.name && x.expression.left.name.text === 'template');
        if(templateProperty) {
            result = templateProperty.expression.right.text;
        }
    }
    else if(/public template(: string)? = `/.test(ast.text)) {
        return /public template(: string)? = `((.|\n)*)`;/g.exec(ast.text)[2];
    }

    if(result === 'template') {
        return '';
    }

    return result;
};