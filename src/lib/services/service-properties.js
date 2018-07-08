const ts = require('typescript');
const kind = ts.SyntaxKind;
const getProperties = require('../get-properties');

module.exports.get = function (ast) {

    const methods = ast.statements.filter(x => x.kind === kind.MethodDeclaration);
    console.log(methods);
    const theClass = classes[0];

    let results = [];

    if(theClass) {

        const properties = getProperties(theClass);

        results = properties.map((p) => {

            // We only want the one line property declarations
            if (!/;$/.test(ast.text.slice(p.pos, p.end))) {
                return;
            }

            return ast.text.slice(p.pos, p.end);

        }).filter(x=>!!x);
    }

    return results.join('');
};