const fs = require('fs');
const parser = require('../../src/lib/parser');

module.exports = function(path) {
    const code = fs.readFileSync(path, 'UTF-8');
    const ast = parser.parse(code, {});
    return ast;
};