import { Inject, Injectable } from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import { HttpLink } from 'apollo-angular-link-http';
import { AuthService } from './auth.service';
import { ApolloLink, concat } from 'apollo-link';
import { HttpHeaders } from '@angular/common/http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';
import { DefaultOptions } from 'apollo-client/ApolloClient';

@Injectable({
  providedIn: 'root'
})
export class ApolloService {
  protected operationName: string;
  protected operationType: string;
  protected params: object;
  protected postData: object;
  protected selection: string;
  protected metaData: string[];
  protected query;

  constructor(
    public apollo: Apollo,
    public httpLink: HttpLink,
    public auth: AuthService,
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

    apollo.create({
      link: concat(authMiddleware, link),
      cache: new InMemoryCache(),
      defaultOptions: defaultOptions
    });
  }

  getMetaData(result) {
    let metaArray = [];
    let meta = this.metaData;

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

  setPostData(postData: object) {
    this.postData = postData;
    return this;
  }

  setSelection(selection: string, wrapper?: string) {
    if (wrapper) {
      selection = wrapper + '{' + selection + '}';
    }
    this.selection = selection;
    return this;
  }

  setMetaData(metaData?: string[]) {
    if (!metaData) {
      this.metaData = ['total', 'per_page', 'current_page', 'to', 'from'];
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

    let operationName = '';
    if (!this.operationName) {
      operationName = 'query';
    } else {
      operationName = this.operationName;
    }

    let params = '';
    let metaData = '';
    let queryParams = this.params;

    if (queryParams && operationName.includes('query')) {

      let filterParams = {};
      let paginateParams = {};

      Object.keys(queryParams).forEach(function (index) {
        if (index === 'limit' || index === 'page') {
          paginateParams[index] = queryParams[index];
        } else {
          filterParams[index] = queryParams[index];
        }
      });

      params = 'filter:' + JSON.stringify(filterParams) + ',paging:' + JSON.stringify(paginateParams);
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
      requestString = operationName + '{' + this.operationType + '(' + params + ')';
    } else {
      requestString = operationName + '{' + this.operationType;
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
    console.log(requestString);
    const query = gql`${requestString}`;

    this.query = query;
    return this;
  }

  watchQuery() {
    return this.apollo.watchQuery({query: this.query});
  }

  mutate() {
    return this.apollo.mutate({mutation: this.query});
  }

}
