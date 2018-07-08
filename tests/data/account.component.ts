import { Credentials } from '../../shared/models/credentials.model';
import { OauthService } from '../../shared/services/oauth.service';
import { RedditService } from '../../shared/services/reddit.service';
import { Identity } from '../../shared/models/identity.model';

import * as template from './account.component.html';

export class AccountComponent implements ng.IComponentOptions {
    controller: ng.IControllerConstructor;
    template: string;

    constructor() {
        this.controller = AccountController;
        this.template = String(template);
    }
}

class AccountController implements ng.IComponentController {

    public credentials: Credentials;
    public identity: Identity;

    constructor(private oauthService: OauthService,
                private redditService: RedditService,
                private $location: ng.ILocationService) {
        "ngInject";
    }

    public $onInit() {
        this.credentials = this.oauthService.getCredentials();
        if (!this.credentials || this.credentials.is_expired) {
            return this.$location.path('/login');
        }

        // Initialize request for
        this.redditService.getIdentity()
            .then((identity) => {
                this.identity = identity;
            });
    }

}