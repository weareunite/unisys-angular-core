import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NgxPermissionsGuard} from 'ngx-permissions';

import {AuthGuard} from '../../services/auth-guard.service';
import {SettingsComponent} from './settings.component';
import {CompanyComponent} from './company/company.component';
import {AppComponent} from './app/app.component';
import {GlobalComponent} from './global/global.component';

const adminSettingsRoutes: Routes = [
  {
    path: 'admin/settings', component: SettingsComponent,
    children: [
      {
        path: 'app', component: AppComponent, canActivate: [NgxPermissionsGuard, AuthGuard],
        data: {permissions: {only: ['admin.settings'], redirectTo: ''}}
      },
      {
        path: 'company', component: CompanyComponent, canActivate: [NgxPermissionsGuard, AuthGuard],
        data: {permissions: {only: ['admin.settings'], redirectTo: ''}}
      },
      {
        path: 'global', component: GlobalComponent, canActivate: [NgxPermissionsGuard, AuthGuard],
        data: {permissions: {only: ['admin.settings'], redirectTo: ''}}
      },
    ]
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(adminSettingsRoutes)
  ],
  exports: [RouterModule]
})
export class AdminSettingsRoutingModule {
}
