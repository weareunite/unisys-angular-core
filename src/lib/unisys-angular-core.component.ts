import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { UnisysAngularAppStateServiceService } from '@weareunite/unisys-angular-app-state-service';
import { UserService } from './services/user.service';
import { Subscription } from 'rxjs';
import { SettingsService } from './services/settings.service';
import { BrowserSupportService } from './services/browser-support.service';
import { VersionCheckService } from './services/version-check.service';
import { InitService } from '../../../../src/app/services/init.service';

@Component({
  selector: 'app-root',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './app.component.html',
  styleUrls: [
    './app.component.scss',
    './../styles.css'
  ]
})

export class UnisysAngularCoreComponent {
  private stateSubscription: Subscription;
  public state;

  constructor(
    private user: UserService,
    private settingsService: SettingsService,
    private browserSupportService: BrowserSupportService,
    private versionCheckService: VersionCheckService,
    private appState: UnisysAngularAppStateServiceService,
    private router: Router,
    private init: InitService,
    public  auth: AuthService
  ) {
    if (this.auth.isAuthenticated()) {
      this.user.loadProfile();
      this.settingsService.getAll();
    } else {
      this.router.navigate(['/signin']);
    }
  }

  ngOnInit() {
    this.init.boot();
    this.browserSupportService.determineBrowser();
    console.debug('Valid browser ? ' + this.browserSupportService.isValid());
    console.debug('Browser : ' + this.browserSupportService.getBrowser());
    console.debug('Version : ' + this.browserSupportService.getVersion());
    this.stateSubscription = this.appState.stateChanged
      .subscribe(
        state => {
          this.state = state;
        }
      );
  }

}
