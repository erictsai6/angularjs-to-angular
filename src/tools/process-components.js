const ts = require('typescript');
const path = require('path');
const writeFile = require('../lib/write-file');
const removeFromConstructor = require('../lib/remove-from-constructor');
const getSourceFile = require('../lib/get-source-file');
const renderSourceFile = require('../lib/render-source-file');
const imports = require('../lib/components/component-imports');
const variables = require('../lib/variables');
const interfaces = require('../lib/components/component-interfaces');
const enums = require('../lib/components/component-enums');
const decorator = require('../lib/components/component-decorator');
const componentClass = require('../lib/components/component-class');
const makeDirectoriesInPath = require('../lib/make-directories-in-path');
const renderTemplate = require('../lib/render-template');
const methods = require('../lib/get-methods');
const getLifecycleEvents = require('../lib/components/get-lifecycle-events');
const sortBy = require('lodash.sortby');
const processStringReplacements = require('../lib/process-string-replacements');
const updateReferences = require('../lib/update-references');
const getMocks = require('../lib/get-mocks');
const config = require('../config');
const tmpPath = path.join(process.cwd(), config.outputRoot);
const getRelatedSpecFilePath = require('../lib/get-related-spec-file-path');
const buildSpecs = require('../lib/build-specs');
const getOutputFilePath = require('../lib/get-output-file-path');
const replaceControllerStaticReferences = require('../lib/components/replace-controller-static-references');
const addEmitToOutputs = require('../lib/components/add-emit-to-outputs.js');
const pretty = require('../lib/pretty-print');
const getInputsAndOutputs = require('../lib/components/get-input-and-outputs-from-angular-4-component');
const getAngularTemplate = require('../angular/get-template');

module.exports = function (files) {

    sortBy(files).forEach(file => {

        // Read and parse the file's code
        let ast = getSourceFile(file);

        let component = `${imports.get(ast)}${variables.get(ast)}${interfaces.get(ast)}\n${enums.get(ast)}\n${decorator.get(file, ast)}\n${componentClass.get(ast)}`;

        ast = ts.createSourceFile(file, component, ts.ScriptTarget.TS, true);

        // Remove $q, $timeout, and $interval from the constructor
        ast = removeFromConstructor(ast, ['$q', '$timeout', '$interval', '$routeParams']);

        // Render the ast back to typescript
        component = renderSourceFile(ast);

        // Try and clean up the formatting some
        component = pretty.printString(component);

        // Replace controller static references
        component = replaceControllerStaticReferences(getSourceFile(file), component);

        // Do a bunch of string replacements
        component = processStringReplacements(component);

        // Update the references
        component = updateReferences(component);

        // Add emit to output usages within code
        component = addEmitToOutputs(getSourceFile(file), component);

        // Write it out
        const outputFilePath = getOutputFilePath(file);
        makeDirectoriesInPath(outputFilePath);
        writeFile(outputFilePath, component);

        // Create a test file
        const specFilePath = getRelatedSpecFilePath(file);
        const specs = specFilePath ? buildSpecs(specFilePath) : undefined;

        const newComponentAst = ts.createSourceFile(file, component, ts.ScriptTarget.TS, true);
        const newComponentClass = newComponentAst.statements.find(x => x.kind === ts.SyntaxKind.ClassDeclaration);
        const newComponentClassName = newComponentClass.name.text;
        const mocks = getMocks(newComponentAst);
        const inputsAndOutputs = getInputsAndOutputs(newComponentAst);
        const template = getAngularTemplate(outputFilePath);

        const lifecycleEvents = getLifecycleEvents(ast);
        let testFile = renderTemplate('component-test', {
            selector: /selector: '(.*)'/.exec(newComponentAst.text)[1],
            testName: newComponentClassName.replace(/([A-Z])/g, ' $1').trim(),
            componentClass: newComponentClassName,
            componentPath: `./${path.basename(outputFilePath).replace(/\.ts$/, '')}`,
            specs,
            methods: lifecycleEvents.concat(methods.public(newComponentClass).map(m => m.name.text)),
            mocks: sortBy(mocks, m => m.name),
            inputs: inputsAndOutputs.filter(x => x.type === 'Input'),
            outputs: inputsAndOutputs.filter(x => x.type === 'Output'),
            imports: mocks.filter(x => x.import).map(x => x.import).sort(),
            importForms: /"ngModel"/.test(template),
            providers: mocks.map(x => x.provide).filter(x => !!x).sort(),
            variables: mocks.map(x => x.variable).filter(x => !!x).sort(),
            assignments: mocks.map(x => x.assignment).filter(x => !!x).sort(),
            testBedGets: mocks.filter(x => x.useReal).map(x => {
                return `${x.mockName} = TestBed.get(${x.type});`;
            })
        });

        // Do a bunch of string replacements
        testFile = processStringReplacements(testFile);

        // Update References
        testFile = updateReferences(testFile);

        testFile = pretty.printString(testFile);

        // Reverting hack because of prettier choking
        testFile = testFile.replace(/constructxr/g, 'constructor');

        writeFile(outputFilePath.replace('.ts', '.spec.ts'), testFile);

        console.log(`${outputFilePath.replace(process.cwd(), '').replace('.ts', '.spec.ts')}`);
    });

    console.log(`Converted ${files.length} components in ${tmpPath.replace(process.cwd() + '/', '')}.\n\n`);
};