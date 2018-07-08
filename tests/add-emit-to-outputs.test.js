import test from 'ava';
import addEmitsToOutputs from '../src/lib/components/add-emit-to-outputs';
const fs = require('fs');
const path = require('path');
const getAst = require('./utils/get-ast');

test('should return an array of the named imports', (t) => {
    const file = path.join(process.cwd(), 'tests/data/search-input.component.ts');
    const code = fs.readFileSync(file, 'UTF-8');
    t.is((code.match(/onQueryTextUpdated.emit\(/g) || []).length, 0);

    const ast = getAst(file);
    const result = addEmitsToOutputs(ast, code);

    t.is((result.match(/onQueryTextUpdated.emit\(/g) || []).length, 1);
});