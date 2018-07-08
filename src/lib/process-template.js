const cheerio = require('cheerio');
const pretty = require('js-beautify');

// Reference for changes in templates https://angular.io/guide/ajs-quick-reference

module.exports = function (template) {
    let result = template;
    const $ = cheerio.load(result, {
        normalizeWhitespace: false,
        decodeEntities: false
    });

    /*********************************** Processing template with cheerio *********************************/

    // Replace ng-bind
    const mdButton = $('md-button');
    mdButton.each(function () { // Do not use ()=>
        $(this).attr('mat-button', 'mat-button');
    });

    // Replace ng-bind
    const ngBind = $('[ng-bind]');
    ngBind.each(function () { // Do not use ()=>
        const val = $(this).attr('ng-bind');
        $(this).removeAttr('ng-bind');
        $(this).text(`{{${val}}}`);
    });
    ngBind.removeAttr('ng-bind');

    // Replace ng-show
    const ngShow = $('[ng-show]');
    ngShow.each(function () { // Do not use ()=>
        const val = $(this).attr('ng-show');
        $(this).removeAttr('ng-show');
        $(this).attr('[hidden]', `!${val}`);
    });

    // in Angular2, structural directives cannot live on the same element, so *ngIf and *ngRepeat can't be on the same element.
    // solution is to move ngIf to a wrapper like ng-container, and not introduce new html elements.
    // https://angular.io/guide/structural-directives#group-sibling-elements-with-ng-container
    const ngIfngRepeats = $('[ng-if][ng-repeat]');
    ngIfngRepeats.each(function () {
        const $el = $(this);
        const ifVal = $el.attr('ng-if');

        $el.removeAttr('ng-if');
        $el.wrap($(`<ng-container ng-if="${ifVal}"></ng-container>`));
    });

    // Remove ng-model-options
    const ngModelOptions = $('[ng-model-options]');
    ngModelOptions.each(function () {
        $(this).removeAttr('ng-model-options');
    });

    const allInputs = $('input, select');
    allInputs.each(function() {
        const name = $(this).attr('name');
        if(name) {
            $(this).attr(`#${name}`, 'ngModel');
        }
    });

    result = $('body').html();

    /*********************************** Processing template with regex replace ***************************/

    // Cheerio adds ="" to empty attributes
    result = result.replace(/=""/g, '');

    // Replace ng-if with *ngIf
    result = result.replace(/ng-if/g, '*ngIf');

    // Replace one time bindings
    result = result.replace(/"::/g, '"');
    result = result.replace(/{::/g, '{');

    // Remove $ctrl
    result = result.replace(/\::\$ctrl\./g, '');
    result = result.replace(/\$ctrl\./g, '');

    // Replace ng-click with (click)
    result = result.replace(/([^\w])ng-click([^\w])/g, '$1(click)$2');

    // Replace ng-dblclick with (dblclick)
    result = result.replace(/([^\w])ng-dblclick([^\w])/g, '$1(dblclick)$2');

    // Replace ng-blur with (blur)
    result = result.replace(/([^\w])ng-blur([^\w])/g, '$1(blur)$2');

    // Replace ng-focus with (focus)
    result = result.replace(/([^\w])ng-focus([^\w])/g, '$1(focus)$2');

    // Replace ng-mouseenter with (mouseenter)
    result = result.replace(/([^\w])ng-mouseenter([^\w])/g, '$1(mouseenter)$2');

    // Replace ng-mouseleave with (mouseleave)
    result = result.replace(/([^\w])ng-mouseleave([^\w])/g, '$1(mouseleave)$2');

    // Replace ng-mouseover with (mouseover)
    result = result.replace(/([^\w])ng-mouseover([^\w])/g, '$1(mouseover)$2');

    // Replace ng-keypress with (keypress)
    result = result.replace(/([^\w])ng-keypress([^\w])/g, '$1(keypress)$2');

    // Replace ng-keydown with (keydown)
    result = result.replace(/([^\w])ng-keydown([^\w])/g, '$1(keydown)$2');

    // Replace ng-change with (change)
    result = result.replace(/([^\w])ng-change([^\w])/g, '$1(change)$2');

    // Replace ng-change with (change)
    result = result.replace(/([^\w])ng-submit([^\w])/g, '$1(ngSubmit)$2');

    // Replace track by with trackBy
    result = result.replace(/([^\w])track by (\w+)(\..*)"/g, ';trackBy:$2?$3"');

    // Replace ng-href with [href]
    result = result.replace(/([^\w])ng-href([^\w])/g, '$1[href]$2');
    result = result.replace(/\[href\]="((\w|\/)+)"/g, 'href="$1"');
    result = result.replace(/\[href\]="(.+){{(.*)}}(.*)"/g, '[href]="`$1${$2}$3`"');
    result = result.replace(/\[href\]="{{(.*)}}"/g, '[href]="$1"');
    result = result.replace(/\[href\]="`(.*)\${(.*)}(.*)`"/g, '[href]="\'$1\' + $2 + \'$3\'"');
    result = result.replace(/\[href\]="(.*) \+ ''"/g, '[href]="$1"');

    // Replace ng-class with [ngClass]
    result = result.replace(/([^\w])ng-class([^\w])/g, '$1[ngClass]$2');

    // Replace ng-style with [ngStyle]
    result = result.replace(/([^\w])ng-style([^\w])/g, '$1[ngStyle]$2');

    // Replace ng-src with [src]
    result = result.replace(/([^\w])ng-src([^\w])/g, '$1[src]$2');

    // Replace ng-bind-html with [innerHtml]
    // https://stackoverflow.com/questions/34585453/how-to-bind-raw-html-in-angular2
    result = result.replace(/([^\w])ng-bind-html([^\w])/g, '$1[innerHtml]$2');

    // Replace ng-hide with [hidden]
    result = result.replace(/([^\w])ng-hide([^\w])/g, '$1[hidden]$2');

    // Replace ng-disabled with [disabled]
    result = result.replace(/(ng-| )disabled="(.*)"/g, '[disabled]="$2"');

    // Replace ng-checked with [checked]
    // https://stackoverflow.com/questions/40214655/angular-2-checkbox-two-way-data-binding
    result = result.replace(/(ng-| )checked="(.*)"/g, '[checked]="$2"');

    // Replace ng-model with [(ngModel)]
    result = result.replace(/([^\w])ng-model([^\w])/g, '$1[(ngModel)]$2');

    // Replace ng-value with [value]
    result = result.replace(/([^\w])ng-value([^\w])/g, '$1[value]$2');

    // Replace ng-required with [required]
    result = result.replace(/(ng-| )required="(.*)"/g, '[required]="$2"');

    // Replace ng-pattern with [pattern]
    result = result.replace(/(ng-| )pattern="(.*)"/g, '[pattern]="$2"');

    // Replace ng-repeat="x in ..." with *ngFor="let x of"
    result = result.replace(/([^\w])ng-repeat="(\w+)\sin\s([^"]*)"/g, '$1*ngFor="let $2 of $3"');

    // Replace track by with ; trackBy
    result = result.replace(/track by/g, ';trackBy:');

    // Replace limitTo pipe in ngRepeats with slice pipe
    result = result.replace(/limitTo\s?:\s?([^"]*)/g, 'slice:0:$1');

    // Replace ng-switch-when with *ngSwitchCase
    result = result.replace(/([^\w])ng-switch-when([^\w])/g, '$1*ngSwitchCase$2');

    // Replace ng-switch-default with *ngSwitchDefault
    result = result.replace(/([^\w])ng-switch-default([^\w])/g, '$1*ngSwitchDefault$2');

    // Replace ng-switch with [ngSwitch]
    result = result.replace(/([^\w])ng-switch([^\w])/g, '$1[ngSwitch]$2');

    // Replace itemtype with [attr.itemtype]
    result = result.replace(/itemtype="{{(.*)}}"/, '[attr.itemtype]="$1"');

    // Replace ng-view with router-outlet
    result = result.replace(/ng-view/g, 'router-outlet');

    // Replace ng-view with router-outlet
    result = result.replace(/ng-view/g, 'router-outlet');

    result = pretty.html(result, {
        unformatted: ['code', 'pre', 'em', 'strong'],
        indent_inner_html: true,
        indent_char: ' ',
        indent_size: 4,
        sep: '\n',
        wrap_attributes: 'force-aligned',
    });
    return result;
};