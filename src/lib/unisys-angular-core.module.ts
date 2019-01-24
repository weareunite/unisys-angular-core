import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FooterComponent} from './footer/footer.component';
import {HeaderComponent} from './header/header.component';
import {AppRoutingModule} from './modules/app-routing.module';
import {NgxPermissionsModule} from 'ngx-permissions';
import {UserProfileComponent} from './header/user-profile/user-profile.component';
import {AppSettingsComponent} from './header/app-settings/app-settings.component';
import {BsDatepickerModule, ModalModule, TabsModule, TooltipModule} from 'ngx-bootstrap';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToastrModule} from 'ngx-toastr';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {HttpClient} from '@angular/common/http';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {AsideComponent} from './aside/aside.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

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
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
  ],
  declarations: [
    FooterComponent,
    HeaderComponent,
    UserProfileComponent,
    AppSettingsComponent,
    AsideComponent],
  exports: []
})
export class UnisysAngularCoreModule {
}
