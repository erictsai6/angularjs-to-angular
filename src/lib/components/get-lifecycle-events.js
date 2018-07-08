module.exports = function (ast) {
    const events = [];

    if (/\$onInit/.test(ast.text)) {
        events.push('OnInit');
    }

    if (/\$onChanges/.test(ast.text)) {
        events.push('OnChanges');
    }

    if (/\$onDestroy/.test(ast.text)) {
        events.push('OnDestroy');
    }

    return events;
};