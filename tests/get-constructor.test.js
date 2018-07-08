import test from 'ava';
import getConstructor from '../src/lib/get-constructor';
import getControllerClass from '../src/lib/components/get-controller-class';
const path = require('path');
const getAst = require('./utils/get-ast');
const file = path.join(process.cwd(), 'tests/data/account.component.ts');

test('should return the contructor', (t) => {
    const ast = getAst(file);
    const controllerClass = getControllerClass(ast);
    const controller = getConstructor(controllerClass);
    const result = ast.text.slice(controller.pos, controller.end);

    const expected = `constructor(private oauthService: OauthService,
                private redditService: RedditService,
                private $location: ng.ILocationService) {
        "ngInject";
    }`;

    t.deepEqual(result.trim(), expected.trim());

});