import {Injectable, OnInit} from '@angular/core';
import {Subject} from 'rxjs';

import {HttpService} from './http.service';
import {Contact} from '../models';
import { ApolloService } from './apollo.service';

@Injectable({
  providedIn: 'root'
})

export class SettingsService {

    protected apolloInstnc;
    itemChanged = new Subject<any>();
    listChanged = new Subject<any[]>();
    companyChanged = new Subject<any>();
    settingsChanged = new Subject<any>();
    protected item;
    protected itemList;
    public company: Contact;
    public settings: any;

    // Apollo
    protected selectionCompany = 'id,name';
    protected selectionSettings = 'key,value';

    constructor(
        protected http: HttpService,
        protected apollo: ApolloService,
    ) {}

//C(R)UD

    getAll() {
        // let reguestUrl = this.url+'/all'
        // this.http.get(reguestUrl).subscribe(data => {
        //     let dataToSet = {
        //         'allowed_number_of_projects':1,
        //     };
        //     this.setSettings(dataToSet);
        // });

        const operationType = 'settings';

        this.apolloInstnc = this.apollo.setOperationName('query')
            .setOperationType(operationType)
            .setSelection(this.selectionSettings, 'data')
            .watchQuery();

        this.apolloInstnc.valueChanges.subscribe(result => {
            const data = result['data'][operationType];
            this.setSettings(data);
        });

    }

    getCompany() {

        const operationType = 'companyProfile';

        this.apolloInstnc = this.apollo.setOperationName('query')
            .setOperationType(operationType)
            .setSelection(this.selectionCompany)
            .watchQuery();

        this.apolloInstnc.valueChanges.subscribe(result => {
            const data = result['data'][operationType];
            this.setCompany(data);
        });
    }

//CR(U)D

    updateCompany(item:Contact) {
        // const requestUlr = this.url + '/company';
        // this.http.put(requestUlr, item).subscribe(data => {
        //     this.setCompany(item);
        // });
        //
        // this.apolloInstnc = this.apollo.setOperationName('mutation')
        //     .setOperationType('companyProfile')
        //     .setSelection(this.selectionCompany)
        //     .watchQuery();
        //
        // this.apolloInstnc.valueChanges.subscribe(result => {
        //     console.log(result);
        //     this.setCompany(result['data']);
        // });
    }

// SETTERS

    setSettings(settings) {
        this.settings = settings;
        this.settingsChanged.next(this.settings);
    }

    setCompany(item:Contact) {
        this.company = item;
        this.companyChanged.next(this.company);
    }

}
