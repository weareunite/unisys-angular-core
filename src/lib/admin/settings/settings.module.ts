import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings.component';
import { SharedModule } from '../../shared/shared.module';
import { AdminSettingsRoutingModule } from './settings-routing.module';
import { CompanyComponent } from './company/company.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { AppComponent } from './app/app.component';
import {NgxPermissionsModule} from 'ngx-permissions';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
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
export class SettingsModule { }
