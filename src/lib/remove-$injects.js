const ts = require('typescript');
const kind = ts.SyntaxKind;

module.exports = function(ast) {
    ast.statements.filter(s => s.kind === kind.ClassDeclaration).forEach(c => {
        c.members = c.members.filter(m => {
            if (!m.name) {
                return true;
            }
            return m.name.text !== '$inject';
        });
    });

    return ast;
};