const getContructor = require('../get-constructor');
const getClass = require('../get-class');

module.exports.get = function (ast) {
    let result = '';

    const theClass = getClass(ast);
    if(!theClass) {
        return result;
    }

    const constructor = getContructor(theClass);
    
    if (!constructor) {
        return result;
    }

    result = ast.text.slice(constructor.pos, constructor.end);

    return result;
};