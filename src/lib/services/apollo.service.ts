import { Inject, Injectable } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import { HttpLink } from 'apollo-angular-link-http';
import { AuthService } from './auth.service';
import { ApolloLink, concat } from 'apollo-link';
import { HttpHeaders } from '@angular/common/http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';
import { DefaultOptions } from 'apollo-client/ApolloClient';
import { onError } from 'apollo-link-error';
import { ToastrService } from 'ngx-toastr';


@Injectable({
    providedIn: 'root'
})
export class ApolloService {
    protected operationName: string;
    protected operationType: string;
    protected params: object = null;
    protected postData: object;
    protected selection: string;
    protected metaData: string[];
    protected query;
    public enumOperators = {
        operators: [
            'and',
            'or',
            'between'
        ],
        custom: {}

    };

    constructor(
        private apollo: Apollo,
        public httpLink: HttpLink,
        public auth: AuthService,
        public toastr: ToastrService,
        @Inject('env') private environment,
    ) {

        const link = httpLink.create({
            uri: this.environment.GRAPHQL_API_URL
        });

        const defaultOptions: DefaultOptions = {
            watchQuery: {
                fetchPolicy: 'no-cache',
                errorPolicy: 'ignore',
            },
            query: {
                fetchPolicy: 'no-cache',
                errorPolicy: 'all',
            },
        };

        const errorMiddleware = onError(({graphQLErrors, networkError}) => {
            if (graphQLErrors) {
                graphQLErrors.map(({message, locations, path}) =>
                    toastr.error(message, 'GraphQL Error'),
                );
            }

            if (networkError) {
                toastr.error(networkError.message, 'Network Error');
            }
        });

        const authMiddleware = new ApolloLink((operation, forward) => {
            operation.setContext({
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + this.auth.getAccessToken(),
                })
            });
            return forward(operation);
        });

        const linkWithErrors = ApolloLink.from([
            authMiddleware,
            errorMiddleware,
            link
        ]);

        apollo.create({
            link: linkWithErrors,
            cache: new InMemoryCache(),
            defaultOptions: defaultOptions
        });
    }

    replaceSelectionParams(selection: string, params: any[]) {

        Object.keys(params).forEach(function (index) {
            selection = selection.replace('%VARIABLE%', params[index]);
        });

        this.selection = selection;
        return this.selection;
    }

    getMetaData(result) {

        let metaArray = [];
        let meta = this.metaData;

        if (meta.length === 0) {
            this.setDefaultMetaData();
            meta = this.metaData;
        }

        Object.keys(meta).forEach(function (index) {
            metaArray[meta[index]] = result[meta[index]];
        });

        return metaArray;


    }

    setOperationName(operationName?: string) {
        this.operationName = operationName;
        return this;
    }

    setOperationType(operationType: string) {
        this.operationType = operationType;
        return this;
    }

    setParams(params?: object) {
        this.params = params;
        return this;
    }

    setPostData(postData?: object) {
        if (postData) {
            this.postData = postData;
        } else {
            delete this.postData;
        }

        return this;
    }

    setSelection(selection: string, wrapper?: string, replaceParams?: any[]) {

        if (replaceParams) {
            selection = this.replaceSelectionParams(selection, replaceParams);
        }

        if (wrapper) {
            selection = wrapper + '{' + selection + '}';
        }

        this.selection = selection;
        return this;
    }

    setDefaultMetaData() {
        this.metaData = ['total', 'per_page', 'current_page', 'to', 'from'];
    }

    setMetaData(metaData?: string[]) {
        if (!metaData) {
            this.setDefaultMetaData();
        } else {
            this.metaData = metaData;
        }
        return this;
    }

    clearMetaData() {
        this.metaData = [];
        return this;
    }

    setQuery() {

        if (!this.operationName) {
            this.setOperationName('query');
        }

        let params = '';
        let metaData = '';

        if (this.params && this.operationName.includes('query')) {

            let baseParams = {};
            let filterParams = {};
            let paginateParams = {};

            Object.keys(this.params).forEach(function (index) {
                if (index === 'limit' || index === 'page') {
                    paginateParams[index] = this.params[index];
                } else if (index === 'order') {
                    filterParams[index] = this.params[index];
                } else if (index === 'distinct') {
                    filterParams[index] = this.params[index];
                } else {
                    if (!filterParams['conditions']) {
                        filterParams['conditions'] = [];
                    }
                    Object.keys(this.params[index]).forEach(function (subIndex) {
                        let data = [];
                        let conditionItem = {};
                        let params = this.params[index][subIndex];

                        if (this.params[index][subIndex].hasOwnProperty('base') && this.params[index][subIndex].hasOwnProperty('base') === true) {
                            baseParams[subIndex] = params['values'];
                        } else {

                            if (Array.isArray(this.params[index][subIndex]) && !this.params[index][subIndex].values) {
                                data = this.params[index][subIndex];
                            } else if (this.params[index][subIndex].values) {
                                data = this.params[index][subIndex].values;
                            } else {
                                data.push(this.params[index][subIndex]);
                            }

                            if (this.params[index][subIndex].operator) {

                                conditionItem = {
                                    field: subIndex,
                                    values: data.map(String),
                                    operator: this.params[index][subIndex].operator
                                };
                            } else {
                                conditionItem = {field: subIndex, values: data.map(String)};
                            }
                            filterParams['conditions'].push(conditionItem);
                        }
                    }, this);
                }
            }, this);

            if (Object.keys(baseParams).length > 0) {

                let baseStringified = JSON.stringify(baseParams);
                let haveFilter = false;
                let havePaging = false;

                if (Object.keys(filterParams).length > 0) {

                    if (Object.keys(filterParams).length === 1 && filterParams.hasOwnProperty('conditions') && filterParams['conditions'].length === 0) {
                        haveFilter = false;
                    } else {
                        haveFilter = true;
                    }
                }

                if (haveFilter || havePaging) {
                    baseStringified = baseStringified.substring(0, baseStringified.length - 1);
                }

                params = baseStringified;

                if (Object.keys(paginateParams).length > 0) {
                    havePaging = true;
                }

                if (haveFilter) {
                    params += ',filter:' + JSON.stringify(filterParams);
                }

                if (havePaging) {
                    params += ',paging:' + JSON.stringify(paginateParams);
                }

                if (haveFilter || havePaging) {
                    params += '}';
                }
            } else {
                params = 'filter:' + JSON.stringify(filterParams);

                if (Object.keys(paginateParams).length > 0) {
                    params += ',paging:' + JSON.stringify(paginateParams);
                }
            }
        } else {
            params = JSON.stringify(this.postData);
        }

        if (params) {
            params = params.replace(/\"([^(\")"]+)\":/g, '$1:');
        } else {
            params = '';
        }

        if (params.charAt(0) === '{') {
            let paramLength = params.length - 1;
            params = params.substring(1, paramLength);
        }

        let requestString = '';

        if (params) {
            requestString = this.operationName + '{' + this.operationType + '(' + params + ')';
        } else {
            requestString = this.operationName + '{' + this.operationType;
        }

        if (this.selection) {
            requestString = requestString + '{' + this.selection;
            if (this.metaData && this.metaData.length > 0) {
                metaData = this.metaData.join(',');
                requestString = requestString + ',' + metaData + '}';
            } else {
                requestString = requestString + '}';
            }
        }
        requestString = requestString + '}';
        requestString = this.fixEnumOperators(requestString);

        // requestString = requestString.replace(/"between"/g, 'between');
        // requestString = requestString.replace(/"and"/g, 'and');
        // requestString = requestString.replace(/"or"/g, 'or');

        // Console debug of Apollo request in order - Operation name / Operation type / Query parameters / Full string
        // console.debug('%c---------------------------------------------START----------------------------------------------', 'color:black;');
        // console.debug('%cQuery Type: %c' + this.operationName, 'color:red;font-weight:bold;', 'color:blue;');
        // console.debug('%cQuery Name: %c' + this.operationType, 'color:red;font-weight:bold;', 'color:blue;');
        // console.debug('%cParams: %c' + params, 'color:red;font-weight:bold;', 'color:blue;');
        // console.debug('%cFull Request: %c' + requestString, 'color:red;font-weight:bold;', 'color:blue;');
        // console.debug('%c----------------------------------------------END-----------------------------------------------', 'color:black;');

        console.log([this.operationName + ' ' + this.operationType, requestString]);

        const query = gql`${requestString}`;

        this.query = query;

        return this;
    }

    fixEnumOperators(string: string) {

        let enumOperators = this.enumOperators;

        Object.keys(enumOperators['operators']).forEach(function (index) {
            let regex = new RegExp('operator:"' + enumOperators['operators'][index] + '"', 'g');
            string = string.replace(regex, 'operator:' + enumOperators['operators'][index]);
        });

        Object.keys(enumOperators['custom']).forEach(function (index) {

            Object.keys(enumOperators['custom'][index]).forEach(function (subIndex) {

                let customRegex = new RegExp(index + ':"' + enumOperators['custom'][index][subIndex] + '"', 'g');
                string = string.replace(customRegex, index + ':' + enumOperators['custom'][index][subIndex]);
            });
        });

        return string;
    }

    watchQuery() {
        return this.apollo.query({query: this.query});
    }

    mutate() {
        return this.apollo.mutate({mutation: this.query});
    }

}
