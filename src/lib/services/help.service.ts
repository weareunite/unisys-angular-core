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
  protected selection = 'id, name, url, username';
  protected operationType = 'help';
  protected operationTypePlural = 'help';

  constructor(
    protected http: HttpService,
    protected apollo: ApolloService,
    protected appStateService: UnisysAngularAppStateServiceService,
  ) {
    super(http, appStateService, apollo);
  }

}
