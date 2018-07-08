const ts = require('typescript');
const kind = ts.SyntaxKind;

module.exports.get = function (ast) {
    const variables = ast.statements.filter(x => x.kind === kind.VariableStatement);

    const results = variables.map(v => {
        return ast.text.slice(v.pos, v.end);
    });

    return results.join('');
};