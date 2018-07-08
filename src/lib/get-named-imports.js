const ts = require('typescript');
const kind = ts.SyntaxKind;
const sortBy = require('lodash.sortby');

module.exports = function(ast) {
    const results = [];
    const imports = ast.statements.filter(x=>x.kind === kind.ImportDeclaration);

    imports.forEach(i => {
        if(i.importClause && i.importClause.namedBindings && i.importClause && i.importClause.namedBindings.elements) {
            i.importClause.namedBindings.elements.forEach(e => {
                results.push({
                    name: e.name.text, 
                    path: i.moduleSpecifier.text
                });
            });
        }
    });

    return sortBy(results, (r) => {
        return r.name;
    });
};