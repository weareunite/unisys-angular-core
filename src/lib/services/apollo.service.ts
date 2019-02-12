import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular-link-http';
import { AuthService } from './auth.service';
import { environment } from '../../../../../src/environments/environment';
import { ApolloLink, concat } from 'apollo-link';
import { HttpHeaders } from '@angular/common/http';
import { InMemoryCache } from 'apollo-cache-inmemory';

@Injectable({
  providedIn: 'root'
})
export class ApolloService {

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

  call(query) {
    console.log(query);
    return this.apollo.watchQuery({query: query});
  }

}
