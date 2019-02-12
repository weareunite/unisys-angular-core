import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AsideComponent} from './aside/aside.component';
import {FooterComponent} from './footer/footer.component';
import {HeaderComponent} from './header/header.component';
import {UnisysAngularSharedModule} from './shared/unisys-angular-shared.module';
import {AppRoutingModule} from './app-routing.module';
import {NgxPermissionsModule} from 'ngx-permissions';
import {UserProfileComponent} from './header/user-profile/user-profile.component';
import {AppSettingsComponent} from './header/app-settings/app-settings.component';
import {BsDatepickerModule, ModalModule, TabsModule, TooltipModule} from 'ngx-bootstrap';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToastrModule} from 'ngx-toastr';
import { HttpLinkModule } from 'apollo-angular-link-http';
import { ApolloModule } from 'apollo-angular';

@NgModule({
  imports: [
    CommonModule,
    UnisysAngularSharedModule,
    AppRoutingModule,
    NgxPermissionsModule.forRoot(),
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    TabsModule.forRoot(),
    TooltipModule.forRoot(),
    ApolloModule,
    HttpLinkModule
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
    AppRoutingModule,
    ApolloModule,
    HttpLinkModule,
  ]
})
export class CoreModule {
}
