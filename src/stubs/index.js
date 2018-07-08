const path = require('path');
const rimraf = require('rimraf');
const fs = require('fs');
const encoding = 'UTF-8';
const parser = require('../lib/parser');
const getMethods = require('../lib/get-methods');
const kind = require('../lib/kind');
const ensureDirectoryExistence = require('../lib/make-directories-in-path');
const getNamedImports = require('../lib/get-named-imports');

module.exports = function (files) {
    const tmpPath = path.join(process.cwd(), '.tmp/stubs');
    const exports = [];

    // Clean the temp directory
    rimraf.sync(tmpPath);

    // Process each file from the glob
    files.forEach(file => {
        console.log(`Processing: ${file}`);

        const code = fs.readFileSync(file, encoding);
        const ast = parser.parse(code, {});

        // Get the exported class
        const classes = ast.statements.filter(x => x.kind === kind.ClassDeclaration && x.modifiers && x.modifiers.some(x => x.kind === kind.ExportKeyword));
        if (classes.length === 0) {
            return;
        }
        const theClass = classes[0];

        // Get the imports for later use
        const namedImports = getNamedImports(ast);

        // Check to see if the class extends from any other service
        let extendsText = '';
        const imports = [];
        if (theClass.heritageClauses && theClass.heritageClauses.length > 0) {
            theClass.heritageClauses.forEach((h) => {
                h.types.filter(x => x.expression && /service/i.test(x.expression.text)).forEach(t => {
                    const extendedStub = `${t.expression.text}Stub`;
                    extendsText += extendedStub;
                    const namedImport = namedImports.find(x => x.name === t.expression.text);
                    if(namedImport) {
                        const importPath = path.basename(namedImport.path) + '.stub';
                        imports.push(`import { ${extendedStub} } from './${importPath}'`);
                    }
                });
            });

            if (extendsText) {
                extendsText = ' extends ' + extendsText;
            }
        }

        // Get all the public method signatures
        const methods = getMethods.public(theClass);
        const signatures = methods.map(m => {
            let sig = ast.text.slice(m.pos, m.body ? m.body.pos : m.initializer.pos);

            // Removes comments from the file
            sig = sig.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '');

            // Replace ng.IPromise with Promise<any>
            sig = sig.replace(/ng\.IPromise(<.*>)?/g, 'Promise<any>');

            const params = /\((.*)\)/g.exec(sig);
            if(params) {
                params[1].split(',').forEach(p => {
                    if(p.split(':').length === 2) {
                        sig = sig.replace(p.split(':')[1], ' any');
                    }
                });
            }

            if(m.body) {
                return `${sig} { ${/Promise/.test(sig) ? '\n        return Promise.resolve();\n    }' : '}'}`;
            }
            else {
                return `${sig} [];`;
            }
        });

        const className = `${theClass.name.text}Stub`;
        const stub = `${imports.join('\n')}

export class ${className}${extendsText} {
    ${signatures.join('')}
}
`; // Break done to add new line to EOF

        // Write it out
        const outputFilePath = path.join(tmpPath, path.basename(file).replace('.ts', '.stub.ts'));
        ensureDirectoryExistence(outputFilePath);
        fs.writeFileSync(outputFilePath, stub, encoding);
        const outputFileName = path.basename(outputFilePath);
        exports.push(`export * from './${outputFileName.replace(/\.ts$/, '')}';`);
        console.log(`Created: ${outputFileName}`);
    });

    const indexContent = `${exports.join('\n')}\n`;
    fs.writeFileSync(path.join(tmpPath, 'index.ts'), indexContent, encoding);

    console.log(`Created ${files.length} stubs in ${tmpPath.replace(process.cwd() + '/', '')}.`);
};
