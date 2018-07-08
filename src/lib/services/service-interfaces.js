const getInterfaces = require('../get-interfaces');

module.exports.get = function (ast) {
    const interfaces = getInterfaces(ast);

    const results = interfaces.map(i => {
        return ast.text.slice(i.pos, i.end);
    });

    return results.join('');
};