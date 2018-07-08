const ts = require('typescript');
const kind = ts.SyntaxKind;

module.exports.all = function getMethods(theClass) {

    const results = [];

    if(!theClass) {
        return results;
    }

    theClass.members.forEach(m => {
        // We don't want public static $inject properties
        if(m.name && m.name.text === '$inject') {
            return;
        }

        // We don't want the constructor as it is handled separately
        if(m.kind === kind.Constructor) {
            return;
        }

        // We don't want the one line property declarations
        if(m.kind === kind.PropertyDeclaration && (!m.initializer || m.initializer && m.initializer.kind !== kind.ArrowFunction)) {
            return;
        }

        // We don't want semi-colon classes
        if(m.kind === kind.SemicolonClassElement) {
            return;
        }

        //We don't want $onInit, $onChanges or $onDestroy property or method declarations as they are handled separately
        if((m.kind === kind.PropertyDeclaration || m.kind === kind.MethodDeclaration) && /(onInit|onChanges|onDestroy)/.test(m.name.text)) {
            return;
        }

        results.push(m);

    });

    return results;
};

module.exports.public = function(theClass) {
    const methods = this.all(theClass);
    return methods.filter(m => m.modifiers && m.modifiers.find(x=> x.kind === kind.PublicKeyword));
};