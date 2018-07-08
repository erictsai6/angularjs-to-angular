
module.exports = function(theClass) {
    let results = [];

    if(theClass && theClass.heritageClauses && theClass.heritageClauses.length > 0) {
        theClass.heritageClauses.forEach((h) => {
            h.types.forEach(t => {
                results.push(t.expression.text);
            });
        });
    }

    return results;
};