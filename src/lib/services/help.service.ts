import { Inject, Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Help } from '../models';
import { UnisysAngularAppStateServiceService } from '@weareunite/unisys-angular-app-state-service';
import { ApolloService } from './apollo.service';
import { BaseApolloService } from './baseApollo.service';

@Injectable({
  providedIn: 'root'
})
export class HelpService extends BaseApolloService {
  private Help: Help;

  // Apollo
  protected selection = 'id, name, key, body';
  protected selectionItem = 'id, name, key, body';
  protected operationType = 'help';
  protected operationTypePlural = 'helps';

  constructor(
    protected http: HttpService,
    protected apollo: ApolloService,
    protected appStateService: UnisysAngularAppStateServiceService,
  ) {
    super(http, appStateService, apollo);
  }

  getItemByKey(key: string) {
    const apolloInstnc = this.apollo.setOperationName('query')
        .setOperationType(this.operationType)
        .setParams()
        .setPostData({key: key})
        .setSelection(this.selectionItem)
        .setMetaData([])
        .setQuery()
        .watchQuery();

    apolloInstnc.subscribe(result => {
      this.setItem(result.data[this.operationType]);
    });
  }

}
