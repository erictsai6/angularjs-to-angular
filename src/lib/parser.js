const ts = require('typescript');

const defaultOptions = {
    experimentalDecorators: true,
    experimentalAsyncFunctions: true,
    jsx: false,
};

module.exports = {
    parse(code, options) {
        options = Object.assign({}, defaultOptions, options);

        const compilerHost = {
            fileExists: () => true,
            getCanonicalFileName: filename => filename,
            getCurrentDirectory: () => '',
            getDefaultLibFileName: () => 'lib.d.ts',
            getNewLine: () => '\n',
            getSourceFile: filename => {
                return ts.createSourceFile(filename, code, ts.ScriptTarget.Latest, true);
            },
            readFile: () => null,
            useCaseSensitiveFileNames: () => true,
            writeFile: () => null,
        };

        const filename = 'file.ts';

        const program = ts.createProgram([filename], {
            noResolve: true,
            target: ts.ScriptTarget.Latest,
            experimentalDecorators: options.experimentalDecorators,
            experimentalAsyncFunctions: options.experimentalAsyncFunctions,
            jsx: options.jsx ? 'preserve' : undefined,
        }, compilerHost);

        const sourceFile = program.getSourceFile(filename);

        return sourceFile;
    }
};