const ts = require('typescript');
const kind = ts.SyntaxKind;

module.exports.get = function(ast) {
    return `\n${this.getOnInit(ast)}${this.getOnChanges(ast)}${this.getOnDestroy(ast)}\n`;
};

module.exports.getOnInit = function (ast) {
    const classes = ast.statements.filter(x => x.kind === kind.ClassDeclaration);
    const controllerClass = classes[1];

    if(!controllerClass) {
        return '';
    }

    let onInit = controllerClass.members.find(x => x.name && x.name.text === '$onInit' && (x.initializer || x.body));

    if (onInit) {
        onInit = ast.text.slice(onInit.pos, onInit.end);
        onInit = onInit.replace(/(public|private) ?\$onInit.*/, 'public ngOnInit(): void {');
    }
    else {
        const constructor = controllerClass.members.find(x => x.kind === kind.Constructor);
        if(constructor) {
            onInit = constructor.body.statements.find(s => {
                return /\$onInit/.test(ast.text.slice(s.pos, s.end));
            });
            if (onInit) {
                onInit = ast.text.slice(onInit.pos, onInit.end);
                onInit = onInit.replace(/this\.\$onInit.*{/, 'public ngOnInit(): void {');
                onInit = onInit.replace(/ {4}/g, '  ');
                onInit = onInit.replace(/ {6}/g, '        ');
                onInit = onInit.slice(0, onInit.length - 1);
            }
        }
    }

    return onInit || '';
};

module.exports.getOnChanges = function (ast) {
    const classes = ast.statements.filter(x => x.kind === kind.ClassDeclaration);
    const controllerClass = classes[1];

    if(!controllerClass) {
        return '';
    }

    let onChanges = controllerClass.members.find(x => x.name && x.name.text === '$onChanges' && (x.initializer || x.body));

    if (onChanges) {
        onChanges = ast.text.slice(onChanges.pos, onChanges.end);
        onChanges = onChanges.replace(/(private|public) ?\$onChanges.*{/, 'public ngOnChanges(changes: SimpleChanges): void {');
    }
    else {
        const constructor = controllerClass.members.find(x => x.kind === kind.Constructor);
        if(constructor) {
            onChanges = constructor.body.statements.find(s => {
                return /\$onChanges/.test(ast.text.slice(s.pos, s.end));
            });
            if (onChanges) {
                onChanges = ast.text.slice(onChanges.pos, onChanges.end);
                onChanges = onChanges.replace(/this\.\$onChanges.*/, 'public ngOnChanges(changes: SimpleChanges): void {');
                onChanges = onChanges.replace(/ {4}/g, '  ');
                onChanges = onChanges.replace(/ {6}/g, '        ');
                onChanges = onChanges.slice(0, onChanges.length - 1);
            }
        }
    }

    if(onChanges) {
        onChanges = onChanges.replace(/bindings/g, 'changes');
    }

    return onChanges || '';
};

module.exports.getOnDestroy = function (ast) {
    const classes = ast.statements.filter(x => x.kind === kind.ClassDeclaration);
    const controllerClass = classes[1];

    if(!controllerClass) {
        return '';
    }
    
    let onDestroy = controllerClass.members.find(x => x.name && x.name.text === '$onDestroy' && (x.initializer || x.body));

    if (onDestroy) {
        onDestroy = ast.text.slice(onDestroy.pos, onDestroy.end);
        onDestroy = onDestroy.replace(/(private|public) ?\$onDestroy.*/, 'public ngOnDestroy(): void {');
    }
    else {
        const constructor = controllerClass.members.find(x => x.kind === kind.Constructor);
        if(constructor) {
            onDestroy = constructor.body.statements.find(s => {
                return /\$onDestroy/.test(ast.text.slice(s.pos, s.end));
            });
            if (onDestroy) {
                onDestroy = ast.text.slice(onDestroy.pos, onDestroy.end);
                onDestroy = onDestroy.replace(/this\.\$onDestroy.*{/, 'public ngOnDestroy(): void {');
                onDestroy = onDestroy.replace(/ {4}/g, '  ');
                onDestroy = onDestroy.replace(/ {6}/g, '        ');
                onDestroy = onDestroy.slice(0, onDestroy.length - 1);
            }
        }
    }

    return onDestroy || '';
};
