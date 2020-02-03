import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SettingsComponent} from './settings.component';
import {UnisysAngularSharedModule} from '../../shared/unisys-angular-shared.module';
import {AdminSettingsRoutingModule} from './settings-routing.module';
import {CompanyComponent} from './company/company.component';
import {AppComponent} from './app/app.component';
import {NgxPermissionsModule} from 'ngx-permissions';
import {GlobalComponent} from './global/global.component';

@NgModule({
  imports: [
    CommonModule,
    UnisysAngularSharedModule,
    AdminSettingsRoutingModule,
    NgxPermissionsModule.forChild(),
  ],
  declarations: [
    SettingsComponent,
    CompanyComponent,
    AppComponent,
    GlobalComponent
  ]
})
export class SettingsModule {

}
