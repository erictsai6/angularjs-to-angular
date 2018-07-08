import test from 'ava';
import processReplacements from '../src/lib/process-string-replacements';

test('should replace this.$q.when() with Promise.resolve()', t => {
    const text = 'this.$q.when()';
    const result = processReplacements(text);
    t.is(result, 'Promise.resolve()');
});

test('should replace this.$q.all with Promise.all', t => {
    const text = 'this.$q.all';
    const result = processReplacements(text);
    t.is(result, 'Promise.all');
});

test('should replace this.$q.when({}) with Promise.resolve({})', t => {
    const text = 'this.$q.when({})';
    const result = processReplacements(text);
    t.is(result, 'Promise.resolve({})');
});

test('should replace this.$q.reject() with Promise.reject()', t => {
    const text = 'this.$q.reject(test)';
    const result = processReplacements(text);
    t.is(result, 'Promise.reject(test)');
});

test('should replace let deferred = this.$q.defer(); with native promise', (t) => {
    const text = 'let deferred = this.$q.defer();';
    const result = processReplacements(text);
    t.is(result, `let deferredResolve;
let deferredReject;
let deferred: Promise<any> = new Promise((resolve, reject) => {
    deferredResolve = resolve;
    deferredReject = reject;
});`);
});

test('should replace let deferred: ng.IDeferred<any> = this.$q.defer(); with native promise', (t) => {
    const text = 'let deferred: ng.IDeferred<any> = this.$q.defer();';
    const result = processReplacements(text);
    t.is(result, `let deferredResolve;
let deferredReject;
let deferred: Promise<any> = new Promise((resolve, reject) => {
    deferredResolve = resolve;
    deferredReject = reject;
});`);
});

test('should replace this.$timeout.cancel with clearTimeout', t => {
    const text = 'this.$timeout.cancel(test)';
    const result = processReplacements(text);
    t.is(result, 'clearTimeout(test)');
});

test('should replace this.$timeout with setTimeout', t => {
    const text = 'this.$timeout(() => {}, 200);';
    const result = processReplacements(text);
    t.is(result, 'setTimeout(() => {}, 200);');
});

test('should replace this.$interval.cancel with clearTimeout', t => {
    const text = 'this.$interval.cancel(test)';
    const result = processReplacements(text);
    t.is(result, 'clearInterval(test)');
});

test('should replace this.$interval with setInterval', t => {
    const text = 'this.$interval(() => {}, 200);';
    const result = processReplacements(text);
    t.is(result, 'setInterval(() => {}, 200);');
});

test('should replace finally with then', t => {
    const text = `    .finally(() => {
        this.reorderInProgress = false;
    });`;
    const result = processReplacements(text);
    t.is(result, `    .then(() => {
        // Native promise does not have finally. This then will execute last.
        this.reorderInProgress = false;
    });`);
});

test('should replace finally with then when typed', t => {
    const text = `.finally((): void => {
    this.reorderInProgress = false;
});`;
    const result = processReplacements(text);
    t.is(result, `.then((): void => {
    // Native promise does not have finally. This then will execute last.
    this.reorderInProgress = false;
});`);
});