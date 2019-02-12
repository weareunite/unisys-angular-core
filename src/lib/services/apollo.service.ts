import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';

@Injectable({
  providedIn: 'root'
})
export class ApolloService {

  constructor(
    protected apollo: Apollo,
  ) {
    console.log('apollo ide');
  }

  get(test) {
    console.log('apollo ide' + test);
  }
  call(query) {
    return this.apollo.watchQuery({query: query});
  }
}
