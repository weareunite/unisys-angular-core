import { LOCALE_ID, ModuleWithProviders, NgModule } from '@angular/core';

import { CoreModule } from './core.module';
import { UnisysAngularSharedModule } from './shared/unisys-angular-shared.module';
import { AuthModule } from './auth/auth.module';
import { AuthService } from './services/auth.service';
import { HttpService } from './services/http.service';
import { UserService } from './services/user.service';
import { NotificationService } from './services/notification.service';
import { TagService } from './services/tag.service';
import { CountryService } from './services/country.service';
import { SettingsService } from './services/settings.service';
import { UnisysAngularAppStateServiceService } from '@weareunite/unisys-angular-app-state-service';
import { SettingsModule } from './admin/settings/settings.module';
import { UsersModule } from './admin/users/users.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { InterceptorService } from './services/interceptor.service';
import { RoleModule } from './admin/role/role.module';
import { RoleService } from './services/role.service';
import { UnisysAngularCoreComponent } from './unisys-angular-core.component';
import { DefaultModule } from './default/default.module';
import { CoreService } from './services/core.service';
import { MenuItem } from './models';


@NgModule({
  imports: [
    SettingsModule,
    UsersModule,
    RoleModule,
    CoreModule,
    UnisysAngularSharedModule,
    AuthModule,
    DefaultModule
  ],
  declarations: [
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
    CoreService,
    {provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true}
  ]
})

export class UnisysAngularCoreModule {
  public static forRoot(environment: any,menu: MenuItem[]): ModuleWithProviders {
    return {
      ngModule: UnisysAngularCoreModule,
      providers: [
        HttpService,
        UserService,
        CoreService,
        {
          provide: 'env',
          useValue: environment
        },
        {
          provide: 'menu',
          useValue: menu
        },
      ]
    };
  }
}
