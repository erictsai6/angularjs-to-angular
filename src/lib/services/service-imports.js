const getImports = require('../get-imports');
const unique = require('lodash.uniq');
const sortBy = require('lodash.sortby');

module.exports.get = function (ast) {
    let results = getImports(ast);

    const imports = [];

    // Add Injectable import if the code contain an exported class
    if (/export (abstract )?class/.test(ast.text)) {
        imports.push('Injectable');
    }

    if (/\$window|this\.configuration/.test(ast.text)) {
        imports.push('Inject');
    }

    if (/\$element/.test(ast.text)) {
        imports.push('ElementRef');
    }

    results.push(`import { ${imports.join(', ')} } from '@angular/core';`);

    if ((/\$http\:/.test(ast.text))) {
        results.push('import { HttpClient, HttpHeaders, HttpParams } from \'@angular/common/http\';');
    }

    // (TODO) - New developers please add additional statements if you have custom utilities that you want to import.
    //  we've provided a commented out code snippet below
    // if (/\$ngRedux/.test(ast.text) && !/NgRedux/.test(ast.text)) {
    //     results.push('import { NgRedux } from \'@angular-redux/store\';');
    //     if (!/import { IAppState }/.test(ast.text)) {
    //         results.push('import { IAppState } from \'app/shared/state/app-state\';');
    //     }
    // }

    results = sortBy(unique(results));
    results = results.join('\n');
    return results;
};
