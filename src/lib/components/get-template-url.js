const ts = require('typescript');
const kind = ts.SyntaxKind;

module.exports = function (ast) {
    let templateUrl = '';

    if (/require\((`\.\/\${process.*)\)/.test(ast.text)) {
        const url = /require\((`\.\/\${process.*)\)/.exec(ast.text)[1];
        return url.replace('?test', '');
    }


    const templateImport = ast.statements.find(x => x.kind === kind.ImportDeclaration && x.moduleSpecifier && /\.html/.test(x.moduleSpecifier.text));
    if (templateImport) {
        templateUrl = `'${templateImport.moduleSpecifier.text}'`;
        templateUrl = templateUrl.replace('?test', '');
    }

    return templateUrl;
};