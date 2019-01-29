import {Component, OnInit} from '@angular/core';
import {MenuItem} from '../../models';
import {SettingsService} from '../../services/settings.service';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  private subscription: Subscription;
  public data;
  public context;
  public item;
  private bsModalRef: BsModalRef;

  constructor(
    private modalService: BsModalService,
    private settingsService: SettingsService,
  ) {
    this.context = this;
  }

  ngOnInit() {
    this.subscription = this.settingsService.listChanged
      .subscribe(
        (list) => {
          this.data = list;
        }
      );
    this.settingsService.getAll();
  }

  public mainMenu: MenuItem[] = [
    {routerLink: ['/admin', 'bank-account'], permission: 'admin.bank-account', translation: 'BANK_ACCOUNTS', icon: ''},
    // {routerLink: ['/admin', 'tags'], permission: 'admin.tags', translation: 'TAGS', icon: ''},
    // {routerLink: ['/admin', 'category'], permission: 'admin.category', translation: 'CATEGORIES', icon: ''},
    {routerLink: ['/admin', 'user'], permission: 'admin.users', translation: 'USERS', icon: ''},
    {routerLink: ['/admin', 'settings'], permission: 'admin.settings', translation: 'APP_SETTINGS', icon: ''},
  ];

  public subMenu: MenuItem[] = [
    {routerLink: ['/admin', 'settings', 'app'], permission: 'admin.settings', translation: 'APP_SETTINGS', icon: ''},
    {routerLink: ['/admin', 'settings', 'company'], permission: 'admin.settings', translation: 'PROFILE', icon: ''},
    {
      routerLink: ['/admin', 'settings', 'subscription'],
      permission: 'admin.settings',
      translation: 'SUBSCRIPTION',
      icon: ''
    },
  ];

}
