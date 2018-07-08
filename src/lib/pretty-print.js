const renderSourceFile = require('./render-source-file');
const prettier = require('prettier');

module.exports = {
    printAst,
    printString
};

function printAst(ast) {
    let code = renderSourceFile(ast);
    return printString(code);
}

function printString(code) {

    // The AST printed by typescript doesn't have the same formatting as the orignal file.
    // We start by adding a bunch of line breaks
    code = code.replace(/(\s{4,}};?\s)/g, '$1\n');
    code = code.replace(/(\s{4,}if \(.*)/g, '\n$1');
    code = code.replace(/(\s{4,}return.*)/g, '\n$1');
    code = code.replace(/^(( *)?(export|constructor|interface|class).*)/gm, '\n$1');
    code = code.replace(/(@Injectable().*)/g, '\n$1');
    code = code.replace(/(@Component().*)/g, '\n$1');

    // Now we run the code through prettier
    code = prettier.format(code, {
        parser: 'typescript',
        printWidth: 140,
        tabWidth: 4,
        singleQuote: true
    });
    
    code = code.replace(/(@(Output|Input).*;\n)( +)(public)/g, '$1\n$3$4');

    return code;
}