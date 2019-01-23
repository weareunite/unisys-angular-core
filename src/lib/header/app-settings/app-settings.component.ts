import { Component, OnInit } from '@angular/core';
import {MenuItem, Contact} from '../../models';
import {SettingsService} from '../../services/settings.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-app-settings',
  templateUrl: './app-settings.component.html',
  styleUrls: ['./app-settings.component.css']
})
export class AppSettingsComponent implements OnInit {
    public  company:Contact;
    private settingsSubscription : Subscription;

    constructor(
        private settingsService: SettingsService
    ) { }

    ngOnInit() {
        this.settingsSubscription = this.settingsService.companyChanged
            .subscribe(
                (item) => {
                    this.company = item;
                }
            );
        this.settingsService.getCompany();
    }

    public companyMenuList : MenuItem[] = [
        {routerLink:['admin','bank-account'], permission:'admin.bank-account',translation:'BANK_ACCOUNTS',icon:'fa fa-bank'},
    ];

    public toolsMenuList : MenuItem[] = [];

    public appMenuList : MenuItem[] = [
        {routerLink:['admin','tags'], permission:'admin.tags', translation:'TAGS',icon:'fa fa-tags'},
        {routerLink:['admin','category'], permission:'admin.category', translation:'CATEGORIES',icon:'fa fa-folder-open'},
        {routerLink:['admin','user'], permission:'admin.users', translation:'USERS',icon:'fa fa-users'},
        {routerLink:['admin','roles'], permission:'admin.role', translation:'ROLES', icon: 'fa fa-lock'},
        {routerLink:['admin','settings','app'], permission:'admin.settings' ,translation:'APP_SETTINGS',icon:'fa fa-cog'},
    ];
}
