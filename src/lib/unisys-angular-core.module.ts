import {LOCALE_ID, NgModule} from '@angular/core';

import {CoreModule} from './core.module';
import {SharedModule} from './shared/shared.module';
import {AuthModule} from './auth/auth.module';
import {AuthService} from './auth/auth.service';
import {HttpService} from './services/http.service';
import {UserService} from './services/user.service';
import {NotificationService} from './services/notification.service';
import {BankAccountService} from './services/bank-account.service';
import {TagService} from './services/tag.service'
import {CountryService} from './services/country.service';
import {SettingsService} from './services/settings.service';
import {AppStateService} from './services/app-state.service';
import {UnisysAngularCoreComponent} from './unisys-angular-core.component';
import {BankAccountModule} from './admin/bank-account/bank-account.module';
import {SettingsModule} from './admin/settings/settings.module';
import {UsersModule} from './admin/users/users.module';
import {DefaultModule} from './default/default.module';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {InterceptorService} from './services/interceptor.service';

@NgModule({
  imports: [
    CoreModule,
    SharedModule,
    AuthModule,
    BankAccountModule,
    SettingsModule,
    UsersModule,
    DefaultModule
  ],
  declarations: [
    UnisysAngularCoreComponent
  ],
  providers: [
    AuthService,
    HttpService,
    UserService,
    AppStateService,
    NotificationService,
    BankAccountService,
    TagService,
    CountryService,
    SettingsService,
    {provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true},
  ],
  bootstrap: [
    UnisysAngularCoreComponent,
  ]
})
export class UnisysAngularCoreModule {
}
