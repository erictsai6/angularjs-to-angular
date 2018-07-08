const ts = require('typescript');
const kind = ts.SyntaxKind;
const getBindings = require('./get-bindings');
const getProperties = require('../get-properties');

module.exports.get = function (ast) {
    const classes = ast.statements.filter(x => x.kind === kind.ClassDeclaration);
    const controllerClass = classes[1];

    const result = [];

    if(controllerClass) {

        const properties = getProperties(controllerClass);

        properties.forEach((p) => {

            // We only want the one line property declarations
            if (!/;$/.test(ast.text.slice(p.pos, p.end))) {
                return;
            }

            // We don't want $onInit, $onChanges or $onDestroy property or method declarations 
            // as they are handled separately
            if (/\$(onInit|onChanges|onDestroy)/.test(p.name.text)) {
                return;
            }

            // We don't want any properties that should become input or output bindings
            const bindings = getBindings(ast);
            if (bindings.some(x => x.name === p.name.text)) {
                return;
            }

            result.push(ast.text.slice(p.pos, p.end));

        });
    }

    return result.join('');
};