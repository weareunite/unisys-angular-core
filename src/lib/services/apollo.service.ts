import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular-link-http';
import { AuthService } from './auth.service';
import { environment } from '../../../../../src/environments/environment';
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
  protected selection: string;
  constructor(
      public apollo: Apollo,
      public httpLink: HttpLink,
      public auth: AuthService,
  ) {

    const link = httpLink.create({
      uri: environment.GRAPHQL_API_URL
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

  get(test) {
    console.log('apollo ide' + test);
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

  setSelection(selection: string) {
    this.selection = selection;
    return this;
  }

  fakeCall() {
    // const testString = 'query{allActors2(orderBy: id_ASC){id,name,movies}}';
    const originalString = 'query' + '{' + 'allActors2' + '(' + 'orderBy: id_ASC' + ')' + '{id,name,movies}' + '}';

    // TODO TO REMOVE

    var params = JSON.stringify(this.params);
    params = params.substring(1, params.length - 1);
    params = params.replace(/"/g, '');

    const testString = this.operationName + '{' + this.operationType + '(' + params + '){' + this.selection + '}}';
    console.log(testString);
    console.log(originalString);
    const FeedQuery = gql`${testString}`;
    console.log(FeedQuery);
    return this.apollo.watchQuery({query: FeedQuery});
  }

  call(query) {
    console.log(query);
    return this.apollo.watchQuery({query: query});
  }

}
