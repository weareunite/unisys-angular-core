import {Injectable, OnInit} from '@angular/core';
import {Subject} from 'rxjs';

import {HttpService} from './http.service';
import {Contact} from '../models/contact.model';

@Injectable()

export class SettingsService{

    itemChanged = new Subject<any>();
    listChanged = new Subject<any[]>();
    companyChanged = new Subject<any>();
    settingsChanged = new Subject<any>();
    protected item;
    protected itemList;
    public company: Contact;
    public settings: any;
    protected url: string = 'setting';

    constructor(
        protected http: HttpService,
    ) {}

//C(R)UD

    getItem(id: number) {
        const requestUlr = this.url + '/' + id;
        this.http.get(requestUlr).subscribe(data => {
            this.setItem(data['data']);
        });
    }

    getItemList() {
        this.http.get(this.url).subscribe(data => {
            this.setItemList(data['data']);
        });
    }

    getAll() {
        let reguestUrl = this.url+'/all'
        this.http.get(reguestUrl).subscribe(data => {
            let dataToSet = {
                'allowed_number_of_projects':1,
            };
            this.setSettings(dataToSet);
        });
    }

    getCompany() {
        let reguestUrl = this.url+'/company'
        this.http.get(reguestUrl).subscribe(data => {
            this.setCompany(data['data']);
        });
    }

//CR(U)D

    updateItem(id: number, item) {
        const requestUlr = this.url + '/' + id;
        this.http.put(requestUlr, item).subscribe(data => {
            this.itemChanged.next(item);
        });
    }

    updateItemFromList(item:any) {
        const requestUlr = this.url + '/' + item.id;
        this.http.put(requestUlr, item).subscribe(data => {
            this.itemList.forEach(function(entry, index, object) {
                if (entry.id === item.id) {
                    object[index] = item;
                }
            });
            this.setItemList(this.itemList);
        });
    }

    updateCompany(item:Contact) {
        const requestUlr = this.url + '/company';
        this.http.put(requestUlr, item).subscribe(data => {
            this.setCompany(item);
        });
    }

// SETTERS

    setItem(item:any) {
        this.item = item;
        this.itemChanged.next(this.item);
    }

    setItemList(itemList:any[]) {
        this.itemList = itemList;
        console.log(this.itemList);
        this.listChanged.next(this.itemList);
    }

    setSettings(settings) {
        this.settings = settings;
        this.settingsChanged.next(this.company);
    }

    setCompany(item:Contact) {
        this.company = item;
        this.companyChanged.next(this.company);
    }

}
