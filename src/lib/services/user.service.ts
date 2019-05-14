import { Inject, Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { NgxPermissionsService } from 'ngx-permissions';
import { AuthService } from './auth.service';
import { User } from '../models';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject, Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { UnisysAngularAppStateServiceService } from '@weareunite/unisys-angular-app-state-service';
import { ApolloService } from './apollo.service';
import { BaseApolloService } from './baseApollo.service';
import { TranslateService } from '@ngx-translate/core';
import { InterceptorService } from './interceptor.service';

@Injectable({
    providedIn: 'root'
})
export class UserService extends BaseApolloService {
    public userChanged = new Subject();
    private User: User;
    protected url = 'user';

    // Apollo
    protected selection = 'id, active,name, surname, username, email, roles {id, name}, frontend_permissions {id, name}';
    protected operationType = 'user';
    protected operationTypePlural = 'users';

    constructor(
        protected auth: AuthService,
        protected http: HttpService,
        protected apollo: ApolloService,
        protected httpAngular: HttpClient,
        protected router: Router,
        protected toastrService: ToastrService,
        protected appStateService: UnisysAngularAppStateServiceService,
        private interceptorService: InterceptorService,
        private   permissionsService: NgxPermissionsService,
        public translate: TranslateService,
        @Inject('env') private environment,
    ) {
        super(http, appStateService, apollo);
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
        const operationType = 'profile';

        let apolloInstnc = this.apollo.setOperationName('query')
            .setOperationType(operationType)
            .setSelection(this.selection)
            .setPostData()
            .setMetaData([]) // TODO SET EMPTY VALUE SHOULD MAKE IT NULL
            .setParams()
            .setQuery()
            .watchQuery();

        apolloInstnc.subscribe(result => {
            const data = result['data'][operationType];
            this.setUser(data);
            this.setPermissionsByProfile(data['frontend_permissions']);
            if (this.router.url === '/signin') {
                this.router.navigate(['/default']);
            }
        });
    }

    destroyProfile() {
        this.destroyPermisions();
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

    destroyPermisions() {
        localStorage.removeItem('permissions');
        this.permissionsService.flushPermissions();
    }


    singinUser(email: string, password: string) {

        const postData = {
            grant_type: 'password',
            client_id: this.environment.OAUTH_CLIENT_ID,
            client_secret: this.environment.OAUTH_CLIENT_SECRET,
            username: email,
            password: password,
            scope: ''
        };

        return this.httpAngular.post(this.environment.OAUTH_TOKEN_URL, postData, {
            headers: new HttpHeaders().set('Content-Type', 'application/json'),
        })
            .subscribe(data => {
                this.auth.setAccessToken(data['access_token']);

                let welcomeMessage = '';

                this.translate.get('WELCOME_IN_UNISYS').subscribe((translatedString: string) => {
                    welcomeMessage = translatedString;
                });

                this.toastrService.success('', welcomeMessage);
                this.loadProfile();
            }, error => {
                let message = '';
                let errorTitle = '';

                this.translate.get('ERROR').subscribe((translatedString: string) => {
                    errorTitle = translatedString;
                });

                this.translate.get('WRONG_LOGIN_CREDENTIALS').subscribe((translatedString: string) => {
                    message = translatedString;
                });

                this.toastrService.error(message, errorTitle);
            });
    }

    quickSinginUser(code: string) {
        const postData = {
            short_code: code,
        };

        return this.httpAngular.post(this.environment.OAUTH_FAST_TOKEN_URL, postData, {
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
                let welcomeMessage = '';

                this.translate.get('WELCOME_IN_UNISYS').subscribe((translatedString: string) => {
                    welcomeMessage = translatedString;
                });

                this.toastrService.success('', welcomeMessage);
            }, error => {
                let message = '';
                let errorTitle = '';

                this.translate.get('ERROR').subscribe((translatedString: string) => {
                    errorTitle = translatedString;
                });

                this.translate.get('WRONG_LOGIN_CREDENTIALS').subscribe((translatedString: string) => {
                    message = translatedString;
                });

                this.toastrService.error(message, errorTitle);
            });
    }

    getOneTimeToken() {
        const postData = {
            grant_type: 'client_credentials',
            client_id: this.environment.OAUTH_CLIENT_ID,
            client_secret: this.environment.OAUTH_CLIENT_SECRET,
            scope: ''
        };

        return this.httpAngular.post(this.environment.OAUTH_TOKEN_URL, postData, {
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

    updateUserFromList(item: User) {
        item.password === '' && delete item.password;
        item.password_confirmation === '' && delete item.password_confirmation;
        item = this.createReferenceIdArray(item, ['roles']);
        this.updateItemFromList(item, item);
    }

    pushUserToList(item: User) {
        item.password == '' && delete item.password;
        item.password_confirmation == '' && delete item.password_confirmation;
        item = this.createReferenceIdArray(item, ['roles']);
        this.pushItemToList(item);
    }
}
