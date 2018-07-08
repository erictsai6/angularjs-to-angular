const getBindings = require('./get-bindings');

module.exports = function (ast, code) {

    const bindings = getBindings(ast);
    const outputBindings = bindings.filter(x => x.type === 'output' || x.type === 'two-way');

    for (b of outputBindings) {
        code = code.replace(new RegExp(b.name + '\\(', 'g'), `${b.name}.emit(`);
        //&& isFunction(this.onFilter))
        code = code.replace(new RegExp(`isFunction\\(this\.${b.name}\\)`, 'g'), `isFunction(this.${b.name}.emit)`);
    }

    return code;
};