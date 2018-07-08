import test from 'ava';
import methods from '../src/lib/components/component-methods';
const path = require('path');
const getAst = require('./utils/get-ast');
const glob = require('glob');

const files = glob.sync(path.join(process.cwd(), 'tests/data/**/*component.ts'));

files.forEach(file => {

    test('#get should not return $inject property', t => {
        const ast = getAst(file);
        const result = methods.get(ast);
        t.true(result.indexOf('$inject') === -1, file);
    });

    test('#get should not return $onInit property declaration', t => {
        const ast = getAst(file);
        const result = methods.get(ast);
        t.false(/[public|private] \$onInit/.test(result), file);
    });

    test('#get should not return $onChanges property declaration', t => {
        const ast = getAst(file);
        const result = methods.get(ast);
        t.false(/[public|private] \$onChanges/.test(result), file);
    });

    test('#get should not return $onDestroy property declaration', t => {
        const ast = getAst(file);
        const result = methods.get(ast);
        t.false(/[public|private] \$onDestroy/.test(result), file);
    });

    test('#get should not return the constructor', t => {
        const ast = getAst(file);
        const result = methods.get(ast);
        t.false(/constructor/.test(result), file);
    });    
});

