const getComponentClassName = require('./get-component-class-name');
const getControllerClass = require('./get-controller-class');

module.exports = function (ast, code) {

    const componentClassName = getComponentClassName(ast);
    const controllerClass = getControllerClass(ast);

    if (controllerClass) {
        const controllerName = controllerClass.name.text;

        code = code.replace(new RegExp(`${controllerName}\\.`, 'g'), `${componentClassName}.`);
    }

    return code;
};