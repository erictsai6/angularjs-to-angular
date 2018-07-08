import test from 'ava';
import variables from '../src/lib/variables';
const path = require('path');
const getAst = require('./utils/get-ast');
const file = path.join(process.cwd(), 'tests/data/search-input.component.ts');

test('#get', (t) => {
    const ast = getAst(file);
    const result = variables.get(ast);
    const expected = `

const ENTER_KEYCODE = 13;`;
    t.deepEqual(result, expected);
});