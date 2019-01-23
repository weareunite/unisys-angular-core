import {Injectable} from '@angular/core';
import {HttpService} from './http.service';
import {NgxPermissionsService, NgxRolesService} from 'ngx-permissions';
import {AuthService} from './auth.service';
import {User} from '../models';
import {Router} from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {NotificationService} from './notification.service';
import {environment} from '../enviroments/enviroment';
import {Subject} from 'rxjs/index';
import {BaseService} from './base.service';
import {ToastrService} from 'ngx-toastr';
import {AppStateService} from './app-state.service';
import {FormControl} from '@angular/forms';

@Injectable()
export class UserService extends BaseService {
  public roleListChanged = new Subject();
  public userChanged = new Subject();
  private roleList;
  private User: User;
  protected url = 'user';

  constructor(
    protected auth: AuthService,
    protected http: HttpService,
    protected httpAngular: HttpClient,
    protected router: Router,
    protected notificationService: NotificationService,
    protected toastrService: ToastrService,
    protected appStateService: AppStateService,
    private   permissionsService: NgxPermissionsService,
  ) {
    super(http, appStateService);
  }


  getLocalPermissions() {
    if (localStorage.getItem('permissions')) {
      return JSON.parse(localStorage.getItem('permissions'));
    } else {
      return ['default'];
    }
  }

  loadProfile() {
    this.permissionsService.loadPermissions(this.getLocalPermissions());
    this.http.get('user/profile')
      .subscribe(data => {
        this.setUser(data['data']);
        // this.setPermisonsByRole(data['data']['roles']);
        this.setPermissionsByProfile(data['data']['frontendPermissions']);
        // this.notificationService.getUserUnreadList();
      });
  }

  destroyProfile() {
    this.setPermisonsByRole(null);
    this.setUser(null);
  }

  getUser() {
    return this.User;
  }

  setUser(user) {
    this.User = user;
    this.userChanged.next(this.User);
  }

  setPermissionsByProfile(permissions) {

    const permissionNames = [];

    Object.keys(permissions).forEach(key => {
      permissionNames.push(permissions[key]['name']);
    });

    localStorage.setItem('permissions', JSON.stringify(permissionNames));
    this.permissionsService.loadPermissions(permissionNames);

  }

  setPermisonsByRole(roles?: any[]) {
    if (!roles) {
      localStorage.removeItem('permissions');
      this.permissionsService.flushPermissions();
    } else {
      const filterPermissions = this.filterPermissionsByRole(roles);
      localStorage.setItem('permissions', JSON.stringify(filterPermissions));
      this.permissionsService.loadPermissions(filterPermissions);
    }
  }

  filterPermissionsByRole(selected: any) {
    let permissions = [];
    selected.forEach(function (entry) {
      permissions = permissions.concat(environment.roles[entry.name]);
    });
    return permissions = Array.from(new Set(permissions));
  }

  singinUser(email: string, password: string) {

    const postData = {
      grant_type: 'password',
      client_id: environment.OAUTH_CLIENT_ID,
      client_secret: environment.OAUTH_CLIENT_SECRET,
      username: email,
      password: password,
      scope: ''
    };

    return this.httpAngular.post(environment.OAUTH_TOKEN_URL, postData, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
    })
      .subscribe(data => {
        this.auth.setAccessToken(data['access_token']);
        this.router.navigate(['']);
        this.loadProfile();
        this.toastrService.success('', 'Vitajte v systéme UniSys.');
      }, error => {
        this.toastrService.error('Neplatné prihlasovacie údaje', 'Chyba');
      });
  }

  quickSinginUser(code: string) {
    const postData = {
      short_code: code,
    };

    return this.httpAngular.post(environment.OAUTH_FAST_TOKEN_URL, postData, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
        .append('Accept', 'application/json')
        .append('Authorization', 'Bearer ' + this.auth.getOneTimeToken())
    })
      .subscribe(data => {
        this.auth.setAccessToken(data['access_token']);
        this.loadProfile();
        this.router.navigate(['/']);
        this.auth.unsetOneTimeToken();
        this.toastrService.success('Vitajte v systéme UniSys', 'Bolo použité rýchle prihlásenie');
      }, error => {
        this.toastrService.error('Neplatné prihlasovacie údaje', 'Chyba');
      });
  }

  getOneTimeToken() {
    const postData = {
      grant_type: 'client_credentials',
      client_id: environment.OAUTH_CLIENT_ID,
      client_secret: environment.OAUTH_CLIENT_SECRET,
      scope: ''
    };

    return this.httpAngular.post(environment.OAUTH_TOKEN_URL, postData, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
    })
      .subscribe(data => {
        this.auth.setOneTimeToken(data['access_token']);
      }, error => {
      });
  }


  logOut() {
    this.auth.unsetAccessToken();
    this.destroyProfile();
    this.router.navigate(['/signin']);
  }


  getRoles() {
    const requestUlr = 'role';
    return this.http.get(requestUlr).subscribe(data => {
      this.setRoleList(data['data']);
    });
  }

  setRoleList(itemList) {
    this.roleList = itemList;
    this.roleListChanged.next(this.roleList);
  }

  updateUserFromList(item: User) {
    item.password == '' && delete item.password;
    item.password_confirmation == '' && delete item.password_confirmation;
    item.roles_id = this.returnIdArray(item.roles);
    this.updateItemFromList(item);
  }

  pushUserToList(item: User) {
    item.password == '' && delete item.password;
    item.password_confirmation == '' && delete item.password_confirmation;
    item.roles_id = this.returnIdArray(item.roles);
    this.pushItemToList(item);
  }
}