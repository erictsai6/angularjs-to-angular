const ts = require('typescript');
const getSourceFile = require('../lib/get-source-file');
const uniqueId = require('lodash.uniqueid');

module.exports = function (path) {
    const source = getSourceFile(path);
    const nodes = [];
    let id;
    const parentForDepth = {};

    // Walk the AST tree and pick out the describes and the its and put them in a flat array
    walk(source, 0);

    function walk(node, depth = 0) {

        if (node.kind === ts.SyntaxKind.CallExpression && node.expression.text === 'describe') {
            const newId = +uniqueId();

            nodes.push({
                depth: depth,
                type: 'describe',
                suite: node.arguments[0].text,
                id: newId,
                parentId: parentForDepth[`d_${depth - 6}`]
            });

            if (!parentForDepth[`d_${depth}`]) {
                parentForDepth[`d_${depth}`] = newId;
            }
            id = newId;
        }

        if (node.kind === ts.SyntaxKind.CallExpression && node.expression.text === 'it') {
            nodes.push({
                depth: depth,
                type: 'it',
                test: node.arguments[0].text,
                parentId: id,
                code: source.text.slice(node.pos, node.end)
            });
        }

        if (node.kind === ts.SyntaxKind.CallExpression && node.expression.text === 'beforeEach') {

            nodes.push({
                depth: depth,
                type: 'beforeEach',
                parentId: id,
                code: source.text.slice(node.pos, node.end)
            });
        }
        
        if (node.kind === ts.SyntaxKind.CallExpression && node.expression.text === 'afterEach') {

            nodes.push({
                depth: depth,
                type: 'afterEach',
                parentId: id,
                code: source.text.slice(node.pos, node.end)
            });
        }

        depth++;
        node.getChildren().forEach(c => walk(c, depth));
    }

    // Now convert that flat array back to a tree
    let map = {};
    let node;
    let roots = [];
    for (let i = 0; i < nodes.length; i += 1) {
        node = nodes[i];
        node.children = [];
        map[node.id] = i;
        if (node.parentId) {
            nodes[map[node.parentId]].children.push(node);
        } else {
            roots.push(node);
        }
    }

    return roots;

};