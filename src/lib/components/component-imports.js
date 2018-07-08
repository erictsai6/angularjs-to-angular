const getImports = require('../get-imports');
const getLifecycleEvents = require('./get-lifecycle-events');
const getBindings = require('./get-bindings');
const unique = require('lodash.uniq');
const sortBy = require('lodash.sortby');
const getTemplate = require('./get-template');
const getTemplateUrl = require('./get-template-url');

module.exports.get = function (ast) {
    let results = getImports(ast);
    const lifecycleEvents = getLifecycleEvents(ast);
    const imports = [
        'Component',
        ...lifecycleEvents
    ];

    const bindings = getBindings(ast);

    if (bindings.some(x => x.type === 'input' || x.type === 'two-way')) {
        imports.push('Input');
    }

    if (bindings.some(x => x.type === 'output' || x.type === 'two-way')) {
        imports.push('Output');
        imports.push('EventEmitter');
    }

    if (lifecycleEvents.some(x => x === 'OnChanges')) {
        imports.push('SimpleChanges');
    }

    if (/\$window|this\.configuration/.test(ast.text)) {
        imports.push('Inject');
    }

    if (/\$element/.test(ast.text)) {
        imports.push('ElementRef');
    }

    results.push(`import { ${imports.join(', ')} } from '@angular/core';`);

    if ((/\$http\:/.test(ast.text))) {
        results.push('import { HttpClient } from \'@angular/common/http\';');
    }

    if ((/activatedRouter\:/.test(ast.text))) {
        results.push('import { ActivatedRoute } from \'@angular/router\';');
    }

    if ((/\$location\:/.test(ast.text))) {
        results.push('import { Location } from \'@angular/common\';');
    }

    // (TODO) - New developers please add additional statements if you have custom utilities that you want to import.
    //  we've provided a commented out code snippet below
    // if (/\$ngRedux/.test(ast.text) && !/NgRedux/.test(ast.text)) {
    //     results.push('import { NgRedux } from \'@angular-redux/store\';');
    //     if (!/import { IAppState }/.test(ast.text)) {
    //         results.push('import { IAppState } from \'app/shared/state/app-state\';');
    //     }
    // }

    // We need to remove the template import that is no longer being used
    const template = getTemplate(ast);
    if (!template) {
        const templateUrl = getTemplateUrl(ast);
        if (templateUrl) {
            results = results.filter(x => !(new RegExp(templateUrl)).test(x));
        }
    }

    results = sortBy(unique(results.filter(r => !!r)));
    results = results.join('\n');
    return results;
};
