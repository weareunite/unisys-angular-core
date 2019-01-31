import {LOCALE_ID, NgModule} from '@angular/core';

import {CoreModule} from './core.module';
import {SharedModule} from './shared/shared.module';
import {AuthModule} from './auth/auth.module';
import {AuthService} from './auth/auth.service';
import {HttpService} from './services/http.service';
import {UserService} from './services/user.service';
import {NotificationService} from './services/notification.service';
import {TagService} from './services/tag.service'
import {CountryService} from './services/country.service';
import {SettingsService} from './services/settings.service';
import {UnisysAngularAppStateServiceService} from '@weareunite/unisys-angular-app-state-service';
import {SettingsModule} from './admin/settings/settings.module';
import {UsersModule} from './admin/users/users.module';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {InterceptorService} from './services/interceptor.service';
import {RoleModule} from './admin/role/role.module';
import {RoleService} from './services/role.service';
import {UnisysAngularCoreComponent} from './unisys-angular-core.component';
import {DefaultModule} from './default/default.module';


@NgModule({
  imports: [
    SettingsModule,
    UsersModule,
    RoleModule,
    CoreModule,
    SharedModule,
    AuthModule,
    DefaultModule
  ],
  declarations:[
    UnisysAngularCoreComponent
  ],
  providers: [
    AuthService,
    HttpService,
    UserService,
    UnisysAngularAppStateServiceService,
    NotificationService,
    TagService,
    CountryService,
    SettingsService,
    RoleService,
    {provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true}
  ]
})
export class UnisysAngularCoreModule {
}
