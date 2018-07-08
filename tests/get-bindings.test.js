import test from 'ava';
import getBindings from '../src/lib/components/get-bindings';
const path = require('path');
const getAst = require('./utils/get-ast');

test('should return an array of the named imports', (t) => {
    const file = path.join(process.cwd(), 'tests/data/search-input.component.ts');
    const ast = getAst(file);
    const result = getBindings(ast);
    const expected = [
        {
            name: 'searchQuery',
            type: 'input',
            optional: false
        },
        {
            name: 'onQueryTextUpdated',
            type: 'output',
            optional: false
        }
    ];
    t.deepEqual(result, expected);
});