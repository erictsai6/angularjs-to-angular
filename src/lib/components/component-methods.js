const getMethods = require('../get-methods');
const getControllerClass = require('./get-controller-class');

module.exports.get = function (ast) {
    const controllerClass = getControllerClass(ast);
    const methods = getMethods.all(controllerClass);
    
    const results = methods.map(m => {
        return ast.text.slice(m.pos, m.end);
    });

    return results.join('');
};