import { StorageUtility, StorageKeys } from "../utilities/storage.utility";
import { Credentials } from '../models/credentials.model';
import { OauthService } from './oauth.service';
import { Identity } from '../models/identity.model';
import { SearchQuery } from '../models/search-query.model';

export class RedditService {

    private static ANGULAR = 'angular';
    private static DEFAULT_PARAMS = {
        count: 10
    };

    private apiUrl: string;
    private authorizationUrl: string;
    private clientId: string;
    private redirectUrl: string;
    private scope: string[];

    constructor(
        private $http: ng.IHttpService,
        private configuration,
        private oauthService: OauthService,
        private storageUtility: StorageUtility
    ) {
        this.apiUrl = this.configuration.reddit.apiUrl;
    }

    public getSubreddit(searchQuery?: SearchQuery) {
        const requestConfig = this.getRequestConfig(searchQuery);
        const url = searchQuery && searchQuery.isSearch() ?
            `${this.apiUrl}/r/${RedditService.ANGULAR}/search` :
            `${this.apiUrl}/r/${RedditService.ANGULAR}`;
        return this.$http.get(url, requestConfig)
            .then((response) => {
                return response.data;
            });
    }

    public getIdentity() {
        const requestConfig = this.getRequestConfig();
        return this.$http.get(`${this.apiUrl}/api/v1/me`,  )
            .then((response) => {
                return new Identity(response.data);
            });
    }

    private getRequestConfig(searchQuery?: SearchQuery) {
        const isSearch: boolean = searchQuery && searchQuery.isSearch();

        const credentials = this.oauthService.getCredentials();
        return {
            params: isSearch ? searchQuery.toQuery() : RedditService.DEFAULT_PARAMS,
            headers: {
                Authorization: `Bearer ${credentials.access_token}`
            }
        };
    }

}
