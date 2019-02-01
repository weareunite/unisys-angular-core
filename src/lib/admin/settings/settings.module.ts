import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings.component';
import { UnisysAngularSharedModule } from '../../shared/unisys-angular-shared.module';
import { AdminSettingsRoutingModule } from './settings-routing.module';
import { CompanyComponent } from './company/company.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { AppComponent } from './app/app.component';
import {NgxPermissionsModule} from 'ngx-permissions';

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
      SubscriptionComponent,
      AppComponent
  ]
})
export class SettingsModule {

}
