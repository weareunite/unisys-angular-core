import {Inject, Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {MenuItem} from '../models';
import {ToastrService} from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})

export class CoreService {

  public itemList: MenuItem[] = [];
  public appSettingsItemList: MenuItem[] = [];
  public itemListChanged = new Subject();
  public appItemListPushed = new Subject();
  public appTitle: string;
  public appShorttag: string;

  constructor() {
    this.appSettingsItemList = [
      {routerLink: ['admin', 'user'], permission: 'admin.users', translation: 'USERS', icon: 'fa fa-users'},
      {routerLink: ['admin', 'roles'], permission: 'admin.role', translation: 'ROLES', icon: 'fa fa-lock'},
      {routerLink: ['admin', 'help'], permission: 'admin.help', translation: 'HELP', icon: 'fa fa-question-circle'},
      {routerLink: ['admin', 'logs'], permission: 'admin.log', translation: 'LOGS', icon: 'fa fa-exclamation-circle'},
      {
        routerLink: ['admin', 'error-report'],
        permission: 'admin.error-reports',
        translation: 'ERROR_REPORTS',
        icon: 'fa fa-user-times'
      },
      {
        routerLink: ['admin', 'settings', 'app'],
        permission: 'admin.settings',
        translation: 'APP_SETTINGS',
        icon: 'fa fa-cog'
      },
      {routerLink: [], translation: '', icon: '', divider: true}
    ];
  }

  setAppShorttag(title: string) {
    setTimeout(() => {
      this.appShorttag = title;
    }, 1000);
  }

  setAppTitle(title: string) {
    setTimeout(() => {
      this.appTitle = title;
    }, 1000);
  }

  setAsideMenuList(itemList: MenuItem[]) {
    this.itemList = itemList;
    this.itemListChanged.next(this.itemList);
  }

  pushIntoAppItemList(item) {
    this.appSettingsItemList.push(item);
    this.appItemListPushed.next(item);
  }
}
