const getSpecs = require('./get-specs');

module.exports = function (file) {
    let results = '';
    const specs = getSpecs(file);
    visit(specs[0]);

    function visit(node) {
        let addClose = false;
        if (!node) {
            return;
        }

        if (node.type === 'describe' && !/<Unit Test>/.test(node.suite)) {
            results += `\n${getIndent(node)}xdescribe('${escapeColons(node.suite)}', () => {\n`;
            addClose = true;
        }

        if (node.type === 'it') {
            results += `\n${getIndent(node)}xit('${escapeColons(node.test)}', () => {`;
            results += commentOutCode(node.code);
            addClose = true;
        }

        if (node.type === 'beforeEach') {
            results += `\n${getIndent(node)}beforeEach(() => {`;
            results += commentOutCode(node.code);
            addClose = true;
        }

        if (node.type === 'afterEach') {
            results += `\n${getIndent(node)}afterEach(() => {`;
            results += commentOutCode(node.code);
            addClose = true;
        }

        node.children.forEach(n => visit(n));

        if (addClose) {
            results += `\n${getIndent(node)}});\n`;
        }
    }

    return results;

};

function escapeColons(s) {
    if (!s) {
        return '';
    }

    // Hack because of prettier choking
    s = s.replace(/constructor/g, 'constructxr');

    return s.replace(/'/g, '\\\'');
}

function getIndent(node) {
    let d = node.depth - 4;
    if (d < 0) {
        d = 0;
    }

    return new Array(d).join(' ');
}

function commentOutCode(code) {
    if (!code) {
        return '';
    }

    let lines = code
        .replace(/\/*.*\*\//g, '\n')
        .replace(/\n+/, '')
        .split('\n');

    let firstIndentLine = lines.find(x => /^ +/.test(x));
    let firstIndent = /^( +)\w/.exec(firstIndentLine);
    firstIndent = firstIndent ? firstIndent[1] : '';

    return `
${firstIndent}    /*
${lines.map(x => firstIndent + x).join('\n')}
${firstIndent}       */

`;

}