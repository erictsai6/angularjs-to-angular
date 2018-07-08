import test from 'ava';
import getTemplateUrl from '../src/lib/components/get-template-url';
const path = require('path');
const getAst = require('./utils/get-ast');
const file = path.join(process.cwd(), 'tests/data/search-input.component.ts');

test('should return url for component that has a single template', (t) => {
    const ast = getAst(file);
    const result = getTemplateUrl(ast);
    const expected = '\'./search-input.component.html\'';
    t.deepEqual(result, expected);
});