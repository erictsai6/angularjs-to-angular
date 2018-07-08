const getBindings = require('./get-bindings');
const sortBy = require('lodash.sortby');

module.exports.get = function (ast) {
    const inputs = [];
    const outputs = [];

    const bindings = getBindings(ast);
    // Returns an array of {name: String, type: String, optional: Boolean } where type can be input, output or two-way

    for (b of bindings) {
        if (b.type === 'input' || b.type === 'two-way') {
            inputs.push(`    @Input() public ${b.name}${b.optional ? '?' : ''};`);
        }

        if (b.type === 'output') {
            outputs.push(`    @Output() public ${b.name}${b.optional ? '?' : ''}: EventEmitter<any> = new EventEmitter();`);
        }

        if (b.type === 'two-way') {
            outputs.push(`    @Output() public ${b.name}Change${b.optional ? '?' : ''}: EventEmitter<any> = new EventEmitter();`);
        }
    }

    let result = [
        ...sortBy(inputs),
        ...sortBy(outputs)
    ].join('\n');

    if (result) {
        result = `\n${result}\n`;
    }

    return result;
};