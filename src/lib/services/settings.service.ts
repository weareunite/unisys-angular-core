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

        this.apolloInstnc = this.apollo.setOperationName('query')
            .setOperationType('settings')
            .setSelection(this.selectionSettings,'data')
            .watchQuery();

        this.apolloInstnc.valueChanges.subscribe(result => {
            console.log(result);
            this.setSettings(result['data']);
        });

    }

    getCompany() {
        this.apolloInstnc = this.apollo.setOperationName('query')
            .setOperationType('companyProfile')
            .setSelection(this.selectionCompany)
            .watchQuery();

        this.apolloInstnc.valueChanges.subscribe(result => {
            console.log(result);
            this.setCompany(result['data']);
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
