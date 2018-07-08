import test from 'ava';
import getNamedImports from '../src/lib/get-named-imports';
const path = require('path');
const getAst = require('./utils/get-ast');
const file = path.join(process.cwd(), 'tests/data/account.component.ts');

test('should return an array of the named imports', (t) => {
    const ast = getAst(file);
    const result = getNamedImports(ast);
    const expected = [
        {
            name: 'Credentials',
            path: '../../shared/models/credentials.model'
        },
        {
            name: 'Identity',
            path: '../../shared/models/identity.model'
        },
        {
            name: 'OauthService',
            path: '../../shared/services/oauth.service'
        },
        {
            name: 'RedditService',
            path: '../../shared/services/reddit.service'
        }
    ];
    t.deepEqual(result, expected);
});