const getEnums = require('../get-enums');

module.exports.get = function (ast) {
    const enums = getEnums(ast);

    const results = enums.map(e => {
        return ast.text.slice(e.pos, e.end);
    });

    return results.join('');
};