const replacements = [
    // $q
    [/(ng\.)?IPromise<(.*)>/g, 'Promise<$2>'],
    [/ng\.IHttpPromise<(.*)>/g, 'Promise<$1>'],
    [/(ng\.)?IPromise/g, 'Promise'],
    [/(this|self)\.\$q\.when\(\)/g, 'Promise.resolve()'],
    [/(this|self)\.\$q\.all/g, 'Promise.all'],
    [/( *)(let|const)?\s*defer(red)?:?.*? = (this|self)\.\$q\.defer\(\)/g, '$1let deferredResolve;\n$1let deferredReject;\n$1let deferred: Promise<any> = new Promise((resolve, reject) => {\n$1    deferredResolve = resolve;\n$1    deferredReject = reject;\n$1})'],
    [/defer(red)?\.resolve/g, 'deferredResolve'],
    [/defer(red)?\.reject/g, 'deferredReject'],
    [/defer(red)?\.promise/g, 'deferred'],
    [/(this|self)\.\$q\.when\((.*)\)/g, 'Promise.resolve($2)'],
    [/(this|self)\.\$q\.resolve\((.*)\)/g, 'Promise.resolve($2)'],
    [/(this|self)\.\$q\.reject\((.*)\)/g, 'Promise.reject($2)'],
    [/, this\.\$q/g, ''],
    [/Promise\.reject\(\);/g, 'Promise.reject(new Error(\'An error occurred.\'));'],
    [/\(\$q, /g, '('],

    // $window
    [/private \$window(: (any|ng\.IWindowService))?/g, '@Inject(\'$window\') private $window: any'],

    // configuration
    [/private configuration(: any)?/g, '@Inject(\'configuration\') private configuration: any'],

    // redux
    [/private \$ngRedux(: any)?/g, 'private $ngRedux: NgRedux<IAppState>'],

    // $timeout
    [/(this|self)\.\$timeout\.cancel\((.*)\)/g, 'clearTimeout($2)'],
    [/(this|self)\.\$timeout/g, 'setTimeout'],

    // $interval
    [/(this|self)\.\$interval\.cancel\((.*)\)/g, 'clearInterval($2)'],
    [/(this|self)\.\$interval/g, 'setInterval'],

    [/( *)\.finally\((.*)/g, '$1.then($2\n$1    // Native promise does not have finally. This then will execute last.'],

    // One off issues with PromotionalControllerBase
    [/public abstract \$onInit: \(\) => void;/g, 'public abstract ngOnInit(): void;'],

    [/super\(\$q, \$routeParams, window,/g, 'super($routeParams,'],

    // Modal one off issues
    [/ \({ \$value: any }\?\) => void;/g, ' EventEmitter<any>;'],
    [/this\.dismiss\(\);/, 'this.dismiss.emit();'],

    [/\$http:\s*ng\.IHttpService/g, '$http: HttpClient'],
    [/\$location:\s*ng\.ILocationService/g, '$location: Location'],
    [/\$location\.path/g, '$location.go'],
    [/this\.activatedRouter\.hash\(\)/g, 'this.activatedRoute.snapshot.fragment'],
    [/(this\.\$http\.get\(.*\))/g, '$1.toPromise()'],
    [/params: (.*),/g, 'params: new HttpParams({fromObject: <any>($1) }),'],
    [/headers: {\n(.*)\n.*}\n/g, 'headers: new HttpHeaders({ $1 })'],
    [/response\.data/g, 'response'],
    [/return this\.\$location\.hash\(\)/g, '//return this.$location.hash()'],

    [/angular\.ui\.bootstrap\.\w+/g, 'any'],

    [/ ng\.[^,|\n|;|)| ]*/g, ' any'],

    [/const .* require\(`\.\/\${process.*\);\n/, ''],
    [/\$element: any(,|\))/g, '$element: ElementRef$1'],

    [/Array<(\w+)>/g, '$1[]'],
];

module.exports = function(results) {
    for(r of replacements) {
        results = results.replace(r[0], r[1]);
    }
    return results;
};