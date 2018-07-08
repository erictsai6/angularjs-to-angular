const ts = require('typescript');
const kind = ts.SyntaxKind;
const getProperties = require('../get-properties');

module.exports.get = function (ast) {
    const methods = ast.statements.filter(x => x.kind === kind.ClassDeclaration);
    console.log(methods);
    const theClass = classes[0];

    let results = [];

    return results.join('');
};