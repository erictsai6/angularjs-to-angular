const ts = require('typescript');

module.exports = function(ast) {
    const results = [];
    const klass = ast.statements.find(x=>x.kind === ts.SyntaxKind.ClassDeclaration);

    const inputsAndOutputs = klass.members.filter(
        x => x.kind === ts.SyntaxKind.PropertyDeclaration
        && x.decorators && x.decorators.length > 0);
    
    inputsAndOutputs.forEach(i => {
        results.push({
            type: i.decorators[0].expression.expression.text,
            name: i.name.text
        });
    });

    return results;
};