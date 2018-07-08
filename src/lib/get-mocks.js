const ts = require('typescript');
const getConstructor = require('./get-constructor');
const getImports = require('./get-imports');

module.exports = function (ast) {
    let mocks = [];
    const theClass = ast.statements.find(x => x.kind === ts.SyntaxKind.ClassDeclaration);
    const constructor = getConstructor(theClass);

    function getType(parameter) {
        let type = 'any';
        if (parameter && parameter.type && parameter.type.typeName) {
            type = parameter.type.typeName.text;
        }
        return type;
    }

    function getProvider(mock) {
        let result;
        if (mock.type === 'NgRedux') {
            result = '{ provide: NgRedux, useValue: MockNgRedux.getInstance() }';
        }
        else if (mock.useReal) {
            result = `{ provide: ${mock.type}, useClass: ${mock.type} }`;
        }
        else if (mock.useObject) {
            result = `{ provide: '${mock.name}', useValue: ${mock.mockName} }`;
        }
        else {
            result = `{ provide: ${mock.type}, useValue: instance(${mock.mockName}) }`;
        }

        return result;
    }

    function getVariable(mock) {
        let result;
        if (mock.type === 'NgRedux') {
            return result;
        }
        result = `let ${mock.mockName}${mock.type ? ': ' + mock.type : ''};`;
        return result;
    }

    function getAssignment(mock) {
        let result;
        if (mock.useReal || mock.type === 'NgRedux') {
            return result;
        }

        if (mock.useObject) {
            result = `${mock.mockName} = {};`;
        }
        else if (mock.useMock) {
            result = `${mock.mockName} = mock(${mock.type})`;
        }
        return result;
    }


    const imports = getImports(ast);

    if (constructor && constructor.parameters) {
        constructor.parameters.forEach(p => {
            if (/\$q|\$timeout|\$interval|\$element/.test(p.name.text)) {
                return;
            }

            const type = getType(p);
            if (!type) {
                return;
            }

            let theImport = null;
            if (p.type && p.type.typeName && p.type.typeName.text) {
                theImport = imports.find(x => (new RegExp(' ' + p.type.typeName.text + '[, ]')).test(x));

                if (/NgRedux/.test(theImport)) {
                    theImport += '\nimport { MockNgRedux } from \'@angular-redux/store/testing\';';
                }
            }

            const useReal = /EventsManager/.test(type);
            const useObject = type === 'any';
            let mock = {
                name: p.name.text,
                mockName: `${p.name.text}Mock`,
                type: type,
                import: theImport,
                useReal,
                useObject,
                useMock: !useReal && !useObject
            };

            mock.provide = getProvider(mock);
            mock.variable = getVariable(mock);
            mock.assignment = getAssignment(mock);

            mocks.push(mock);
        });
    }

    return mocks;
};