import {Component, Inject, OnInit, ViewEncapsulation} from '@angular/core';
import {AuthService} from './services/auth.service';
import {Router} from '@angular/router';
import {UnisysAngularAppStateServiceService} from '@weareunite/unisys-angular-app-state-service';
import {UserService} from './services/user.service';
import {Subscription} from 'rxjs';
import {SettingsService} from './services/settings.service';
import {BrowserSupportService} from './services/browser-support.service';
import {VersionCheckService} from './services/version-check.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-root',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './app.component.html',
  styleUrls: [
    './app.component.scss',
    './../styles.css'
  ]
})

export class UnisysAngularCoreComponent implements OnInit {
  private stateSubscription: Subscription;
  public state;

  // Toastr Config
  private progressBar = true;
  private closeButton = true;
  private timeOut = 2000;
  private newestOnTop = true;

  constructor(
    private user: UserService,
    private settingsService: SettingsService,
    private browserSupportService: BrowserSupportService,
    private versionCheckService: VersionCheckService,
    private appState: UnisysAngularAppStateServiceService,
    private toastr: ToastrService,
    private router: Router,
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
    this.toastr.toastrConfig.progressBar = this.progressBar;
    this.toastr.toastrConfig.closeButton = this.closeButton;
    this.toastr.toastrConfig.timeOut = this.timeOut;
    this.toastr.toastrConfig.newestOnTop = this.newestOnTop;

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
