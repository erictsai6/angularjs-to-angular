const fs = require('fs');

module.exports = function (file) {
    const contents = fs.readFileSync(file, 'UTF-8');
    const lines = contents.split('\n');
    const results = [];

    let result;

    lines.forEach(l => {
        const describe = /describe\('(.*)'/.exec(l);
        if (describe) {

            //If we already have a describe, its time to push the result and start again
            if (result) {
                results.push(result);
                result = undefined;
            }

            // We don't want the top level '<Unit Test>'
            if (/unit test/i.test(describe[1])) {
                return;
            }

            result = { group: describe[1], tests: [] };
            return;
        }

        const it = /it\('(.*)'/.exec(l);
        if (it) {
            if (!result) {
                result = { group: '', tests: [] };
            }
            result.tests.push(it[1]);
        }
    });

    return results;
};