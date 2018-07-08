const getLifecycleEvents = require('./get-lifecycle-events');
const inputsAndOutputs = require('./component-inputs-and-outputs');
const constructor = require('./component-constructor');
const lifecycleEvents = require('./component-lifecycle-events');
const properties = require('./component-properties');
const methods = require('./component-methods');
const getControllerClass = require('./get-controller-class');
const getComponentClassName = require('./get-component-class-name');
const getExtendedClasses = require('../get-extended-classes');

module.exports.get = function (ast) {
    const name = getComponentClassName(ast);
    
    let extendedClasses = [];
    const controllerClass = getControllerClass(ast);
    if(controllerClass) {
        const extended = getExtendedClasses(controllerClass);
        extended.forEach(e => {
            if(!/I.*Controller|Bindings/.test(e)) {
                extendedClasses.push(e);
            }
        });
    }
    const extendsText = extendedClasses.length > 0 ? ` extends ${extendedClasses.join(', ')}` : '';
    
    const interfacesImplemented = getLifecycleEvents(ast);
    const implementsText = interfacesImplemented.length > 0 ? ` implements ${interfacesImplemented.join(', ')}` : '';


    let result = `export class ${name}${extendsText}${implementsText} {${inputsAndOutputs.get(ast)}${properties.get(ast)}${constructor.get(ast)}${lifecycleEvents.get(ast)}${methods.get(ast)}\n}`;
    return result;
};