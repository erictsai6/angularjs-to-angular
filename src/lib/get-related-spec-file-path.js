const fs = require('fs');

module.exports = function (file) {
    let specFile;
    if (fs.existsSync(file.replace('.ts', '.spec.ts'))) {
        specFile = file.replace('.ts', '.spec.ts');
    }
    else if (fs.existsSync(file.replace('.ts', '-spec.ts'))) {
        specFile = file.replace('.ts', '-spec.ts');
    }
    return specFile;
};