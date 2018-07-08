const ts = require('typescript');
const kind = ts.SyntaxKind;

module.exports = function(theClass) {
    if(!theClass) {
        return;
    }
    return theClass.members.find(x => x.kind === kind.Constructor);
};