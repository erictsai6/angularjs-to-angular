const getInterfaces = require('../get-interfaces');

module.exports.get = function (ast) {
    const interfaces = getInterfaces(ast);

    const results = interfaces.map(i => {

        // If the interface name ends with "Bindings" or "Controller" we don't want it
        if (/(Bindings|Controller)$/.test(i.name.text)) {
            return;
        }

        return ast.text.slice(i.pos, i.end);
    }).filter(x=>!!x);

    return results.join('');
};