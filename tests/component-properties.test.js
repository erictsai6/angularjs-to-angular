import test from 'ava';
import properties from '../src/lib/components/component-properties';
const path = require('path');
const getAst = require('./utils/get-ast');
const glob = require('glob');

const files = glob.sync(path.join(process.cwd(), 'tests/data/**/*component.ts'));

files.forEach(file => {

    test('#get should not return $inject property', t => {
        const ast = getAst(file);
        const result = properties.get(ast);
        t.false(/\$inject/.test(result), file);
    });

    test('#get should not return $onInit property', t => {
        const ast = getAst(file);
        const result = properties.get(ast);
        t.false(/[public|private] \$onInit/.test(result), file);
    });

    test('#get should not return $onChanges property', t => {
        const ast = getAst(file);
        const result = properties.get(ast);
        t.false(/[public|private] \$onChanges/.test(result), file);
    });

    test('#get should not return $onDestroy property', t => {
        const ast = getAst(file);
        const result = properties.get(ast);
        t.false(/[public|private] \$onDestroy/.test(result), file);
    });

    test('#get should not return the constructor', t => {
        const ast = getAst(file);
        const result = properties.get(ast);
        t.false(/constructor/.test(result), file);
    });    
});