const getTemplate = require('./get-template');
const getTemplateUrl = require('./get-template-url');
const processTemplate = require('../process-template');
const path = require('path');

module.exports.get = function (file, ast) {
    const results = [];
    const template = getTemplate(ast);
    const templateUrl = getTemplateUrl(ast);
    const componentName = path.basename(file).replace(/[\.-]component\.ts/, '');

    results.push(`    selector: '${componentName}'`);
    if (template) {
        results.push(`    template: \`${processTemplate(template)}\``);
    }
    else if(/process\.env/.test(templateUrl)) {
        results.push('    templateUrl');
    }
    else if (templateUrl) {
        results.push(`    templateUrl: ${templateUrl}`);
    }

    return `${/process\.env/.test(templateUrl) ? 'const templateUrl = ' + templateUrl + ';\n' : ''}
@Component({
${results.join(',\n')}
})`;

};