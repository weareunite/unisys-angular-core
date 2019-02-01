import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import {AuthService} from './services/auth.service';
import {Router} from '@angular/router';
import {UnisysAngularAppStateServiceService} from '@weareunite/unisys-angular-app-state-service';
import {UserService} from './services/user.service';
import {Subscription} from 'rxjs';
import {SettingsService} from "./services/settings.service";

@Component({
  selector: 'app-root',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './app.component.html',
  styleUrls: [
    './app.component.scss',
    './../styles.css'
  ]
})

export class UnisysAngularCoreComponent implements OnInit{
  private stateSubscription: Subscription;
  public state;

  constructor(
    private user: UserService,
    private settingsService: SettingsService,
    private appState: UnisysAngularAppStateServiceService,
    private router: Router,
    public  auth: AuthService,
    @Inject('menu') private asideMenu,
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
