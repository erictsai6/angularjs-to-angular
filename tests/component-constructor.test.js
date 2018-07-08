import test from 'ava';
import constructor from '../src/lib/components/component-constructor';
const path = require('path');
const getAst = require('./utils/get-ast');
const glob = require('glob');

const files = glob.sync(path.join(process.cwd(), 'tests/data/**/*component.ts'));

files.forEach(file => {

    test('#get should not return $onInit property in contructor', t => {
        const ast = getAst(file);
        const result = constructor.get(ast);
        t.false(/\$onInit/.test(result), file);
    });

    test('#get should not return $onChanges property in constructor', t => {
        const ast = getAst(file);
        const result = constructor.get(ast);
        t.false(/\$onChanges/.test(result), file);
    });

    test('#get should not return $onDestroy property in constructor', t => {
        const ast = getAst(file);
        const result = constructor.get(ast);
        t.false(/\$onDestroy/.test(result), file);
    });

});

test('#get should return the contructor text', t => {
    const ast = getAst(path.join(process.cwd(), 'tests/data/account.component.ts'));
    const result = constructor.get(ast);
    t.deepEqual(result.trim(), `
    constructor(private oauthService: OauthService,
                private redditService: RedditService,
                private $location: ng.ILocationService) {
        "ngInject";
    }`.trim());
});