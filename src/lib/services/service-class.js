const getClass = require('../get-class');
const constructor = require('./service-constructor');
const properties = require('./service-properties');
const methods = require('./service-methods');
const getExtendedClasses = require('../get-extended-classes');

module.exports.get = function (ast) {
    const theClass = getClass(ast);
    const extendedClasses = getExtendedClasses(theClass);
    let extendsText = '';

    if(extendedClasses && extendedClasses.length > 0) {
        extendsText = ` extends ${extendedClasses.join(', ')}`;
    }

    let result = `\n\n@Injectable()\nexport class ${theClass.name.text}${extendsText} {${properties.get(ast)}${constructor.get(ast)}${methods.get(ast)}\n}`;
    return result;
};