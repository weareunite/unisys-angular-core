import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FooterComponent} from './footer/footer.component';
import {HeaderComponent} from './header/header.component';
import {AppRoutingModule} from './app-routing.module';
import {NgxPermissionsModule} from 'ngx-permissions';
import {UserProfileComponent} from './header/user-profile/user-profile.component';
import {AppSettingsComponent} from './header/app-settings/app-settings.component';
import {BsDatepickerModule, ModalModule, TabsModule, TooltipModule} from 'ngx-bootstrap';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToastrModule} from 'ngx-toastr';
import {AsideComponent} from './aside/aside.component';
import {SharedModule} from './shared/shared.module';
import {RouterModule} from '@angular/router';
import {AuthModule} from './auth/auth.module';
import {DefaultModule} from './default/default.module';

@NgModule({
  imports: [
    CommonModule,
    AppRoutingModule,
    NgxPermissionsModule.forRoot(),
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    TabsModule.forRoot(),
    TooltipModule.forRoot(),
    AppRoutingModule,
    SharedModule,
    RouterModule,
    AuthModule,
    DefaultModule
  ],
  declarations: [
    FooterComponent,
    HeaderComponent,
    UserProfileComponent,
    AppSettingsComponent,
    AsideComponent,
  ],
  exports: [
    FooterComponent,
    HeaderComponent,
    AsideComponent,
    UserProfileComponent,
    AppSettingsComponent,
    RouterModule
  ]
})
export class UnisysAngularCoreModule {
}
