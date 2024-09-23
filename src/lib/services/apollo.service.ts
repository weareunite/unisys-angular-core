import {Inject, Injectable} from '@angular/core';
import {Apollo} from 'apollo-angular';
import {HttpLink} from 'apollo-angular-link-http';
import {AuthService} from './auth.service';
import {ApolloLink, Observable} from 'apollo-link';
import {HttpHeaders} from '@angular/common/http';
import {InMemoryCache} from 'apollo-cache-inmemory';
import gql from 'graphql-tag';
import {DefaultOptions} from 'apollo-client/ApolloClient';
import {onError} from 'apollo-link-error';
import {ToastrService} from 'ngx-toastr';
import {InterceptorService} from './interceptor.service';


@Injectable({
  providedIn: 'root'
})
export class ApolloService {

  protected operationName: string;
  protected operationType: string;
  protected conditions: object = null;
  protected params: object = null;
  protected postData: object;
  protected selection: string;
  protected metaData: string[];
  protected query;
  public enumOperators = {
    operators: [
      'and', 'AND',
      'or', 'OR',
      'between', 'BETWEEN',
      'not', 'NOT',
    ],
    custom: {
      code: ['SK', 'sk'],
      country: ['SK', 'sk'],
      currency: ['EUR', 'eur'],
      current_unit: ['kWh', 'Wh'],
      language: ['SK', 'EN', 'sk', 'en'],
      type: ['PRICE', 'PERCENT', 'price', 'percent'],
      unit: ['MONTHS', 'DAYS', 'WEEKS', 'YEARS', 'months', 'days', 'weeks', 'years'],
      week_day: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    }

  };

  public lastApolloCalls = [];
  private lastApolloCallsLimit = 10;

  constructor(
    private apollo: Apollo,
    public httpLink: HttpLink,
    public auth: AuthService,
    public toastr: ToastrService,
    public interceptorService: InterceptorService,
    @Inject('env') private environment,
  ) {


    const link = httpLink.create({
      uri: this.environment.GRAPHQL_API_URL,
    });

    const openLink = httpLink.create({
      uri: this.environment.GRAPHQL_OPEN_API_URL
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

        Object.keys(graphQLErrors).forEach(function (index) {

          const message = graphQLErrors[index]['message'];
          const debugMessage = graphQLErrors[index]['debugMessage'];


          if (message === 'validation') {
            let validations = {};
            if (graphQLErrors[index]['validation']) {
              validations =  graphQLErrors[index]['validation'];
            } else if (graphQLErrors[index]['extensions'] && graphQLErrors[index]['extensions']['validation']) {
              validations = graphQLErrors[index]['extensions']['validation'];
            }
            Object.keys(validations).forEach((i) => {
              const validation = validations[i];
              const validationMessage = validation[0];
              toastr.error(validationMessage, 'Validation Error');
            }, this);
          } else {
            const translatedMessage = this.interceptorService.translateError(message);
            const translatedDebug = this.interceptorService.translateError(debugMessage);

            toastr.error(translatedDebug, translatedMessage);
          }

        }, this);
      }

      if (networkError) {
        const message = networkError['error']['message'];
        const debugMessage = networkError.message;
        const translatedMessage = this.interceptorService.translateError(message);
        const translatedDebug = this.interceptorService.translateError(debugMessage);

        toastr.error(translatedDebug, translatedMessage);
      }

      //return Observable.of(); // TODO ANALYZE IF IT'S OK
    });

    const authMiddleware = new ApolloLink((operation, forward) => {
      const newUri = this.environment.GRAPHQL_API_URL + '?rid=' + Date.now() + this.generateRandomNumber(4);
      link['options']['uri'] = newUri;
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

    apollo.createNamed('open', {
      link: openLink,
      cache: new InMemoryCache(),
      defaultOptions: defaultOptions
    });
  }

  generateRandomNumber(numbersCount: number) {

    let number = '';

    for (let i = 0; i < numbersCount; i++) {
      number = number + Math.floor(Math.random() * 10);
    }

    return number;
  }

  replaceSelectionParams(selection: string, params: any[]) {

    Object.keys(params).forEach(function (index) {
      selection = selection.replace('%VARIABLE%', params[index]);
    });

    this.selection = selection;
    return this.selection;
  }

  getMetaData(result) {

    const metaArray = [];
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

  setConditions(conditions: any[]) {
    this.conditions = conditions;
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

      const baseParams = {};
      const filterParams = {};
      const paginateParams = {};
      Object.keys(this.params).forEach(function (index) {
        if (index === 'limit' || index === 'page') {
          paginateParams[index] = this.params[index];
        } else if (index === 'order') {
          filterParams[index] = this.params[index];
        } else if (index === 'search') {
          filterParams[index] = this.params[index];
        } else if (index === 'distinct') {
          filterParams[index] = this.params[index];
        } else {
          if (!filterParams['conditions']) {
            filterParams['conditions'] = [];
          }
          if (this.conditions !== null) {
            filterParams['conditions'] = this.conditions;
          }
          Object.keys(this.params[index]).forEach(function (subIndex) {
            let data = [];
            let conditionItem = {};
            const paramsSubindex = this.params[index][subIndex];
            if (this.params[index][subIndex].hasOwnProperty('base') && this.params[index][subIndex].hasOwnProperty('base') === true) {
              baseParams[subIndex] = paramsSubindex['values'];
            } else {
              if (Array.isArray(this.params[index][subIndex])) {
                data = this.params[index][subIndex];
              } else if (typeof this.params[index][subIndex] === 'object' && this.params[index][subIndex] !== null && 'values' in this.params[index][subIndex]) {
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

                if (Array.isArray(data)) {
                  conditionItem = {field: subIndex, operator: 'and', values: data.map(String)};
                } else {
                  conditionItem = {field: subIndex, operator: 'and', values: [String(data)]};
                }
              }
              filterParams['conditions'].push(conditionItem);
            }
          }, this);
        }
      }, this);

      if (this.conditions !== null) {
        filterParams['conditions'] = this.conditions;
      }

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
      const paramLength = params.length - 1;
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

    console.debug([this.operationName + ' ' + this.operationType, requestString]);

    this.pushIntoLatestCall({
      name: this.operationName,
      type: this.operationType,
      string: requestString,
      params: params,
      selection: this.selection
    });

    const query = gql`${requestString}`;

    this.query = query;

    return this;
  }

  fixEnumOperators(string: string) {

    const enumOperators = this.enumOperators;

    Object.keys(enumOperators['operators']).forEach(function (index) {
      const regex = new RegExp('operator:"' + enumOperators['operators'][index] + '"', 'g');
      string = string.replace(regex, 'operator:' + enumOperators['operators'][index]);
    });

    Object.keys(enumOperators['custom']).forEach(function (index) {

      Object.keys(enumOperators['custom'][index]).forEach(function (subIndex) {

        const customRegex = new RegExp(index + ':"' + enumOperators['custom'][index][subIndex] + '"', 'g');
        string = string.replace(customRegex, index + ':' + enumOperators['custom'][index][subIndex]);
      });
    });

    return string;
  }

  pushIntoLatestCall(query) {
    if (Object.keys(this.lastApolloCalls).length === this.lastApolloCallsLimit) {
      this.lastApolloCalls.shift();
    }

    this.lastApolloCalls.push(query);
  }

  watchQuery(queryName: string = '') {

    return this.apollo.query({query: this.query});

    // if (queryName === '') {
    //   return this.apollo.query({query: this.query});
    // } else {
    //   return this.apollo.use(queryName).query({query: this.query});
    // }
  }

  mutate(mutationName: string = '') {

    return this.apollo.mutate({mutation: this.query});

    // if (mutationName === '') {
    //   return this.apollo.mutate({mutation: this.query});
    // } else {
    //   return this.apollo.use(mutationName).mutate({mutation: this.query});
    // }
  }

}
