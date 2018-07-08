import { SearchQuery } from '../../models/search-query.model';

import * as template from './search-input.component.html';

const ENTER_KEYCODE = 13;

export class SearchInputComponent implements ng.IComponentOptions {
    controller: ng.IControllerConstructor;
    template: string;
    bindings;

    constructor() {
        this.controller = SearchInputController;
        this.template = String(template);
        this.bindings = {
            searchQuery: '<',
            onQueryTextUpdated: '&'
        };
    }
}

class SearchInputController implements ng.IComponentController {

    public searchQuery: SearchQuery;
    public queryText: string;
    public onQueryTextUpdated: Function;

    constructor() {
        "ngInject";
    }

    public $onInit() {
        this.getQueryText();
    }

    public $onChanges() {
        this.getQueryText();
    }

    public initiateSearch(event, queryText) {
        if (event && event.keyCode !== ENTER_KEYCODE) {
            return;
        }
        this.onQueryTextUpdated({ $event: queryText });
    }

    private getQueryText() {
        this.queryText = this.searchQuery ? this.searchQuery.queryText : '';
    }
}
