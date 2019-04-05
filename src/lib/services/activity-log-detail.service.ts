import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { activityLog } from '../models';
import { UnisysAngularAppStateServiceService } from '@weareunite/unisys-angular-app-state-service';
import { ApolloService } from './apollo.service';
import { BaseApolloService } from './baseApollo.service';

@Injectable({
    providedIn: 'root'
})
export class ActivityLogDetailService extends BaseApolloService {
    private activityLog: activityLog;

    // Apollo
    protected selection = 'id, log_name, description, properties, subject_id, subject_type, causer_id, causer_type, created_at';
    protected selectionPlural = 'id, description, subject_type, subject_id, properties, created_at, causer_id';
    protected operationType = 'activityLog';
    protected operationTypePlural = 'activityLogs';

    constructor(
        protected http: HttpService,
        protected apollo: ApolloService,
        protected appStateService: UnisysAngularAppStateServiceService,
    ) {
        super(http, appStateService, apollo);
        
        this.page = 1;
        this.limit = 100;
        this.order = 'id';
        this.search = {};
    }

}
