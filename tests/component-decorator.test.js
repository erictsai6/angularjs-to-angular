import test from 'ava';
import decorator from '../src/lib/components/component-decorator';
const path = require('path');
const getAst = require('./utils/get-ast');

test('#get when component has a template url', (t) => {
    const file = path.join(process.cwd(), 'tests/data/account.component.ts');
    const ast = getAst(file);
    const result = decorator.get('account.component.ts', ast);
    const expected = `
@Component({
    selector: 'account',
    templateUrl: './account.component.html'
})`;
    t.deepEqual(result, expected);
});

test('#get when component has a template', (t) => {
    const file = path.join(process.cwd(), 'tests/data/app.component.ts');
    const ast = getAst(file);
    const result = decorator.get('app.component.ts', ast);
    const expected = `
@Component({
    selector: 'app',
    template: \`<div>
    <nav credentials="credentials"></nav>

    <!-- content -->
    <div class="content">
        <router-outlet></router-outlet>
    </div>

</div>\`
})`;
    t.deepEqual(result, expected);
});