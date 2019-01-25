import {Component, ViewEncapsulation} from '@angular/core';
import {AuthService} from './services/auth.service';
import {Router} from '@angular/router';
import {AppStateService} from './services/app-state.service';
import {UserService} from './services/user.service';
import {Subscription} from 'rxjs';
import {SettingsService} from "./services/settings.service";

@Component({
  selector: 'app-root',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './app.component.html',
  styleUrls: [
    './app.component.scss',
    '../../../../node_modules/bootstrap/dist/css/bootstrap.min.css',
    '../../../../node_modules/admin-lte/dist/css/AdminLTE.min.css',
    '../../../../node_modules/admin-lte/dist/css/skins/_all-skins.css',
    '../../../../node_modules/admin-lte/dist/css/skins/skin-purple-light.min.css',
    '../../../../node_modules/font-awesome/css/font-awesome.css',
    '../../../../node_modules/ionicons/dist/css/ionicons.min.css',
    '../../../../node_modules/ngx-bootstrap/datepicker/bs-datepicker.css',
    '../../../../node_modules/ngx-toastr/toastr.css',
    './../styles.css'
  ]
})

export class UnisysAngularCoreComponent {
  private stateSubscription: Subscription;
  public state;

  constructor(
    private user: UserService,
    private settingsService: SettingsService,
    private appState: AppStateService,
    private router: Router,
    public  auth: AuthService,
  ) {
    if (this.auth.isAuthenticated()) {
      this.user.loadProfile();
      this.settingsService.getAll();
    } else {
      this.router.navigate(['/signin']);
    }
  }

  ngOnInit() {
    this.stateSubscription = this.appState.stateChanged
      .subscribe(
        state => {
          this.state = state;
        }
      );
  }

}
