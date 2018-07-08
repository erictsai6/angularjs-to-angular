const ts = require('typescript');
const kind = ts.SyntaxKind;

module.exports = function (ast, parameterNames) {

    ast.statements.filter(s => s.kind === kind.ClassDeclaration).forEach(c => {
        const constructor = c.members.find(x => x.kind === kind.Constructor);
        if (constructor) {
            constructor.parameters = constructor.parameters.filter(p => {
                return parameterNames.indexOf(p.name.text) === -1;
            });

            if (constructor.parameters.find(x => x.name.text === '$locationUtils')) {
                constructor.parameters = constructor.parameters.filter(p => p.name.text !== '$routeParams');
            }
        }
    });

    return ast;
};