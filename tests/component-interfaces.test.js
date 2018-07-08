import test from 'ava';
import interfaces from '../src/lib/components/component-interfaces';
const path = require('path');
const getAst = require('./utils/get-ast');
const file = path.join(process.cwd(), 'tests/data/events-manager.utility.ts');

test('#get', (t) => {
    const ast = getAst(file);
    const result = interfaces.get(ast);
    const expected = `// Event map is a dictionary with event name and list of callbacks
interface IEventMap {
    [name: string]: Array<(data?: any) => void>;
}`;
    t.deepEqual(result, expected);
});