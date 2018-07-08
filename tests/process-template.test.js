import test from 'ava';
import processTemplate from '../src/lib/process-template';

// Cheerio replacements //

test('replaces ng-bind with expression', (t) => {
    const template = '<a class="navLink" ng-href="/account/favorites" ng-bind="::$ctrl.favoritesNavLink"></a><span ng-bind="nested"></span>';
    const result = processTemplate(template);
    const expected = `<a class="navLink"
   href="/account/favorites">{{favoritesNavLink}}</a>
<span>{{nested}}</span>`;
    t.deepEqual(result, expected);
});

test('replaces ng-show with hidden attribute', t => {
    const template = '<button ng-show="$ctrl.newCreditCard"><span ng-show="$ctrl.else"></span></button>';
    const result = processTemplate(template);
    const expected = `<button [hidden]="!newCreditCard">
    <span [hidden]="!else"></span>
</button>`;
    t.deepEqual(result, expected);
});

test('if the same element has ng-if and ng-repeat, ng-if is moved to an ng-container and wraps ng-repeat', t => {
    const template = '<div ng-repeat="item in items" ng-if="$ctrl.something"></div><div ng-if="$ctrl.else" ng-repeat="one in two"></div>';
    const result = processTemplate(template);
    const expected = `<ng-container *ngIf="something">
    <div *ngFor="let item of items"></div>
</ng-container>
<ng-container *ngIf="else">
    <div *ngFor="let one of two"></div>
</ng-container>`;
    t.deepEqual(result, expected);
});

// String replacements //
test('replaces ng-if with *ngIf', t => {
    const template = '<button ng-if="$ctrl.newCreditCard"></button>';
    const result = processTemplate(template);
    const expected = '<button *ngIf="newCreditCard"></button>';
    t.deepEqual(result, expected);
});

test('replaces one time bindings in text', t => {
    const template = '<button>{{::$ctrl.test}}</button>';
    const result = processTemplate(template);
    const expected = '<button>{{test}}</button>';
    t.deepEqual(result, expected);
});

test('replaces one time bindings in attribute', t => {
    const template = '<button ng-if="::$ctrl.test"></button>';
    const result = processTemplate(template);
    const expected = '<button *ngIf="test"></button>';
    t.deepEqual(result, expected);
});

test('removes $ctrl. from template', t => {
    const template = '<button>{{$ctrl.test}}</button>';
    const result = processTemplate(template);
    const expected = '<button>{{test}}</button>';
    t.deepEqual(result, expected);
});

test('replaces ng-click with (click)', t => {
    const template = '<button ng-click="$ctrl.test()"></button>';
    const result = processTemplate(template);
    const expected = '<button (click)="test()"></button>';
    t.deepEqual(result, expected);
});

test('replaces ng-dblclick with (dblclick)', t => {
    const template = '<button ng-dblclick="$ctrl.test()"></button>';
    const result = processTemplate(template);
    const expected = '<button (dblclick)="test()"></button>';
    t.deepEqual(result, expected);
});

test('replaces ng-blur with (blur)', t => {
    const template = '<input ng-blur="$ctrl.test()">';
    const result = processTemplate(template);
    const expected = '<input (blur)="test()">';
    t.deepEqual(result, expected);
});

test('replaces ng-focus with (focus)', t => {
    const template = '<input ng-focus="$ctrl.test()">';
    const result = processTemplate(template);
    const expected = '<input (focus)="test()">';
    t.deepEqual(result, expected);
});


test('replaces ng-mouseenter with (mouseenter)', t => {
    const template = '<button ng-mouseenter="$ctrl.test()"></button>';
    const result = processTemplate(template);
    const expected = '<button (mouseenter)="test()"></button>';
    t.deepEqual(result, expected);
});

test('replaces ng-mouseleave with (mouseleave)', t => {
    const template = '<button ng-mouseleave="$ctrl.test()"></button>';
    const result = processTemplate(template);
    const expected = '<button (mouseleave)="test()"></button>';
    t.deepEqual(result, expected);
});

test('replaces ng-mouseover with (mouseover)', t => {
    const template = '<button ng-mouseover="$ctrl.test()"></button>';
    const result = processTemplate(template);
    const expected = '<button (mouseover)="test()"></button>';
    t.deepEqual(result, expected);
});

test('replaces ng-keypress with (keypress)', t => {
    const template = '<button ng-keypress="$ctrl.test()"></button>';
    const result = processTemplate(template);
    const expected = '<button (keypress)="test()"></button>';
    t.deepEqual(result, expected);
});

test('replaces ng-keydown with (keydown)', t => {
    const template = '<button ng-keydown="$ctrl.test()"></button>';
    const result = processTemplate(template);
    const expected = '<button (keydown)="test()"></button>';
    t.deepEqual(result, expected);
});

test('replaces ng-change with (change)', t => {
    const template = `<select
                        ng-change="applySetAddress()">
                    </select>`;
    const result = processTemplate(template);
    const expected = `<select (change)="applySetAddress()">
</select>`;
    t.deepEqual(result, expected);
});

test('replaces ng-submit with (ngSubmit)', t => {
    const template = '<button ng-submit="$ctrl.test()"></button>';
    const result = processTemplate(template);
    const expected = '<button (ngSubmit)="test()"></button>';
    t.deepEqual(result, expected);
});


test('replaces ng-href with href', t => {
    const template = '<a ng-href="/test">test</a>';
    const result = processTemplate(template);
    const expected = '<a href="/test">test</a>';
    t.deepEqual(result, expected);
});

test('replaces ng-class with [ngClass]', t => {
    const template = '<button ng-class="{ red: $ctrl.isRed() }"></button>';
    const result = processTemplate(template);
    const expected = '<button [ngClass]="{ red: isRed() }"></button>';
    t.deepEqual(result, expected);
});

test('replaces ngStyle with [ngStyle]', t => {
    const template = '<button ng-style="::{\'background-image\': $ctrl.coverImageUrl}"></button>';
    const result = processTemplate(template);
    const expected = '<button [ngStyle]="{\'background-image\': coverImageUrl}"></button>';
    t.deepEqual(result, expected);
});

test('replaces ng-src with [src]', t => {
    const template = '<img ng-src="{{::city.imgSrc}}" class="img-responsive"/>';
    const result = processTemplate(template);
    const expected = `<img [src]="{{city.imgSrc}}"
     class="img-responsive">`;
    t.deepEqual(result, expected);
});

test('replaces ng-bind-html with [innerHtml]', t => {
    const template = '<img ng-bind-html="{{::city.imgSrc}}" class="img-responsive"/>';
    const result = processTemplate(template);
    const expected = `<img [innerHtml]="{{city.imgSrc}}"
     class="img-responsive">`;
    t.deepEqual(result, expected);
});

test('replaces ng-hide with hidden attribute', t => {
    const template = '<button ng-hide="$ctrl.newCreditCard"></button>';
    const result = processTemplate(template);
    const expected = '<button [hidden]="newCreditCard"></button>';
    t.deepEqual(result, expected);
});

test('replaces ng-disabled with disabled attribute', t => {
    const template = '<button ng-disabled="$ctrl.newCreditCard"></button>';
    const result = processTemplate(template);
    const expected = '<button [disabled]="newCreditCard"></button>';
    t.deepEqual(result, expected);
});

test('replaces ng-checked with checked attribute', t => {
    const template = '<input type="checkbox" ng-checked="$ctrl.newCreditCard">';
    const result = processTemplate(template);
    const expected = `<input type="checkbox"
       [checked]="newCreditCard">`;
    t.deepEqual(result, expected);
});

test('replaces ng-model with [(ngModel])', t => {
    const template = '<input type="text" ng-model="test">';
    const result = processTemplate(template);
    const expected = `<input type="text"
       [(ngModel)]="test">`;
    t.deepEqual(result, expected);
});

test('replaces ng-value with [value]', t => {
    const template = '<input type="text" ng-value="test">';
    const result = processTemplate(template);
    const expected = `<input type="text"
       [value]="test">`;
    t.deepEqual(result, expected);
});

test('replaces ng-required with [required]', t => {
    const template = '<input type="text" ng-required="test">';
    const result = processTemplate(template);
    const expected = `<input type="text"
       [required]="test">`;
    t.deepEqual(result, expected);
});

test('replaces ng-pattern with [pattern]', t => {
    const template = '<input type="text" ng-pattern="test">';
    const result = processTemplate(template);
    const expected = `<input type="text"
       [pattern]="test">`;
    t.deepEqual(result, expected);
});

test('replaces ng-repeat with *ngFor', t => {
    const template = '<div ng-repeat="section in $ctrl.sections"></div>';
    const result = processTemplate(template);
    const expected = '<div *ngFor="let section of sections"></div>';
    t.deepEqual(result, expected);
});

test('replaces ng-repeat with *ngFor when ng-repeat breaks across lines', t => {
    const template = `<div ng-repeat="cuisine in ::$ctrl.resolveData.modal.data.cuisines
                    track by cuisine.value">
        </div>`;

    const result = processTemplate(template);

    const expected = `<div *ngFor="let cuisine of resolveData.modal.data.cuisines
                   ;trackBy:cuisine?.value">
</div>`;
    t.deepEqual(result, expected);
});

test('replace limitTo pipe with slice pipe', t => {
    const template = `<li ng-repeat="cuisine in ::$ctrl.restaurant.cuisines | limitTo : 2">
                </li>`;
    const result = processTemplate(template);
    const expected = `<li *ngFor="let cuisine of restaurant.cuisines | slice:0:2">
</li>`;

    t.deepEqual(result, expected);
});

test('replace limitTo pipe with slice pipe when limitTo is complex', t => {
    const template = `<li
        ng-repeat="breadcrumb in ::$ctrl.breadcrumbs() | limitTo:$ctrl.breadcrumbs().length - 1">
    </li>`;
    const result = processTemplate(template);
    const expected = `<li *ngFor="let breadcrumb of breadcrumbs() | slice:0:breadcrumbs().length - 1">
</li>`;

    t.deepEqual(result, expected);
});

test('replaces limitTo pipe in binding', t => {
    const template = '<span ng-bind="::$ctrl.itemController.getOrderSummaryText(slide) | limitTo: 22"></span>';
    const result = processTemplate(template);
    const expected = '<span>{{itemController.getOrderSummaryText(slide) | slice:0:22}}</span>';

    t.deepEqual(result, expected);
});

test('replaces ng-switch with [ngSwitch]', t => {
    const template = `<span ng-switch="$ctrl.template">
            <span ng-switch-when="footer">
                Junk
            </span>
            <span ng-switch-default>
                More Junk
            </span>
        </span>`;

    const result = processTemplate(template);

    const expected = `<span [ngSwitch]="template">
    <span *ngSwitchCase="footer">
        Junk
    </span>
    <span *ngSwitchDefault>
        More Junk
    </span>
</span>`;
    t.deepEqual(result, expected);
});