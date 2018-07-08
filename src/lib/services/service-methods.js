const getMethods = require('../get-methods');
const getClass = require('../get-class');

module.exports.get = function (ast) {
    const theClass = getClass(ast);
    const methods = getMethods.all(theClass);
    
    const results = methods.map(m => {
        return ast.text.slice(m.pos, m.end);
    });

    return results.join('');
};