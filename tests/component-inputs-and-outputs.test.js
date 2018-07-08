import test from 'ava';
import inputsAndOutputs from '../src/lib/components/component-inputs-and-outputs';
const path = require('path');
const getAst = require('./utils/get-ast');

test('#get', (t) => {
    const file = path.join(process.cwd(), 'tests/data/search-input.component.ts');
    const ast = getAst(file);
    const result = inputsAndOutputs.get(ast);
    const expected = `
    @Input() public searchQuery;
    @Output() public onQueryTextUpdated: EventEmitter<any> = new EventEmitter();
`;
console.log(result);
    t.deepEqual(result, expected);
});
