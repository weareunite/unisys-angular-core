import {Inject, Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import { Language, MenuItem } from '../models';
import {ToastrService} from 'ngx-toastr';
import { BsLocaleService, defineLocale, enGbLocale, skLocale } from 'ngx-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { UnisysAngularAppStateServiceService } from '@weareunite/unisys-angular-app-state-service';

@Injectable({
  providedIn: 'root'
})

export class CoreService {

  public itemList: MenuItem[] = [];
  public langList: Language[] = [];
  public appSettingsItemList: MenuItem[] = [];
  public itemListChanged = new Subject();
  public langListChanged = new Subject();
  public appItemListPushed = new Subject();
  public appTitle: string;
  public appShorttag: string;

  constructor(
      private translate: TranslateService,
      private localeService: BsLocaleService,
      private appStateService: UnisysAngularAppStateServiceService
  ) {
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
    setTimeout(() => {
      this.itemList = itemList;
      this.itemListChanged.next(this.itemList);
    }, 1000);
  }

  setLangList(langList: Language[]) {
    setTimeout(() => {
      this.langList = langList;
      this.langListChanged.next(this.langList);
    }, 1000);
  }

  pushIntoAppItemList(item) {
    this.appSettingsItemList.push(item);
    this.appItemListPushed.next(item);
  }

  setTranslation(langCode) {
      this.appStateService.setAppState(langCode,'language');
      location.reload();
  }
}
