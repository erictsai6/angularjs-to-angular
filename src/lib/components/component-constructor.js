const getContructor = require('../get-constructor');
const getControllerClass = require('./get-controller-class');

module.exports.get = function (ast) {
    let result = '';

    const controllerClass = getControllerClass(ast);
    if (!controllerClass) {
        return result;
    }

    const constructor = getContructor(controllerClass);

    if (!constructor) {
        return result;
    }

    result = ast.text.slice(constructor.pos, constructor.end);


    // Need to remove lifecycle events from constructor
    const onInit = constructor.body.statements.find(s => {
        return /\$onInit/.test(ast.text.slice(s.pos, s.end));
    });
    if (onInit) {
        result = result.replace(ast.text.slice(onInit.pos, onInit.end), '');
    }

    const onChanges = constructor.body.statements.find(s => {
        return /\$onChanges/.test(ast.text.slice(s.pos, s.end));
    });
    if (onChanges) {
        result = result.replace(ast.text.slice(onChanges.pos, onChanges.end), '');
    }

    const onDestroy = constructor.body.statements.find(s => {
        return /\$onDestroy/.test(ast.text.slice(s.pos, s.end));
    });
    if (onDestroy) {
        result = result.replace(ast.text.slice(onDestroy.pos, onDestroy.end), '');
    }

    result = result.replace(/(private|protected) activatedRouter: ActivatedRouter,/, '$1 activatedRoute: ActivatedRoute,');

    return result;
};