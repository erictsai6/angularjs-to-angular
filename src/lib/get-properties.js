const ts = require('typescript');
const kind = ts.SyntaxKind;

module.exports = function(theClass) {
    const results =  theClass.members.map(p => {
        if (p.kind !== kind.PropertyDeclaration) {
            return;
        }

        if (p.name && p.name.text === '$inject') {
            return;
        }

        return p;
    }).filter(x=>!!x);

    return results;
};