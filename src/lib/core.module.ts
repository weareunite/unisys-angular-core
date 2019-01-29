import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AsideComponent} from './aside/aside.component';
import {FooterComponent} from './footer/footer.component';
import {HeaderComponent} from './header/header.component';
import {SharedModule} from './shared/shared.module';
import {AppRoutingModule} from './app-routing.module';
import {NgxPermissionsModule} from 'ngx-permissions';
import {UserProfileComponent} from './header/user-profile/user-profile.component';
import {AppSettingsComponent} from './header/app-settings/app-settings.component';
import {BsDatepickerModule, ModalModule, TabsModule, TooltipModule} from 'ngx-bootstrap';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToastrModule} from 'ngx-toastr';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    AppRoutingModule,
    NgxPermissionsModule.forRoot(),
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    TabsModule.forRoot(),
    TooltipModule.forRoot()
  ],
  declarations: [
    AsideComponent,
    FooterComponent,
    HeaderComponent,
    UserProfileComponent,
    AppSettingsComponent
  ],
  exports: [
    AsideComponent,
    FooterComponent,
    HeaderComponent,
    AppRoutingModule
  ]
})
export class CoreModule {
}
