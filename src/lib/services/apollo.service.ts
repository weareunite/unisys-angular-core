import { Inject, Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular-link-http';
import { AuthService } from './auth.service';
import { ApolloLink, concat } from 'apollo-link';
import { HttpHeaders } from '@angular/common/http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import gql from 'graphql-tag';

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

  constructor(
    public apollo: Apollo,
    public httpLink: HttpLink,
    public auth: AuthService,
    @Inject('env') private environment,
  ) {

    const link = httpLink.create({
      uri: this.environment.GRAPHQL_API_URL
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

    apollo.create({
      link: concat(authMiddleware, link),
      cache: new InMemoryCache(),
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

  setParams(params: object) {
    this.params = params;
    return this;
  }

  setPostData(postData: object) {
    this.postData = postData;
    return this;
  }

  setSelection(selection: string) {
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

  watchQuery() {
    let operationName = '';
    if (!this.operationName) {
      operationName = 'query';
    } else {
      operationName = this.operationName;
    }

    let params = '';
    let metaData = '';
    if (operationName.includes('query')) {
      params = 'filter:' + JSON.stringify(this.params);
    } else {
      params = JSON.stringify(this.postData);
    }
    params = params.replace(/\"([^(\")"]+)\":/g, '$1:');

    if (operationName !== 'query') {
      params = params.replace('{', '');
      params = params.replace('}', '');
    }

    var testString = operationName + '{' + this.operationType + '(' + params + ')';
    if (this.selection) {
      testString = testString + '{' + this.selection;
      if (this.metaData.length > 0) {
        metaData = this.metaData.join(',');
        testString = testString + ',' + metaData + '}';
      } else {
        testString = testString + '}';
      }
    }
    testString = testString + '}';
    console.log(testString);
    const query = gql`${testString}`;

    if (operationName === 'query') {
      return this.apollo.watchQuery({query: query});
    } else {
      return this.apollo.mutate({mutation: query});
    }
  }

}
