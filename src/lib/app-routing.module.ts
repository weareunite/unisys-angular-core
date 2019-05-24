import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './services/auth-guard.service';
import { ReportListComponent } from './error-reporting/report-list/report-list.component';
import { NgxPermissionsGuard } from 'ngx-permissions';

const appRoutes: Routes = [
  {path: '', redirectTo: 'default', pathMatch: 'full'},
  {path: 'app', redirectTo: 'default', pathMatch: 'full'},
  {path: 'default', redirectTo: 'admin/products', pathMatch: 'full'},
  {path: 'admin/roles', loadChildren: './admin/role/role.module#RoleModule'},
  {path: 'admin/settings', loadChildren: './admin/settings/settings.module#SettingsModule'},
  {path: 'admin/user', loadChildren: './admin/users/users.module#UsersModule'},
  {path: 'admin/help', loadChildren: './admin/help/admin-help.module#AdminHelpModule'},
  {path: 'admin/logs', loadChildren: './admin/log/admin-log.module#AdminLogModule'},
  {
    path: 'admin/error-report',
    component: ReportListComponent,
    canActivate: [NgxPermissionsGuard, AuthGuard],
    data: {permissions: {only: ['admin.shifts'], redirectTo: ''}}
  },
];


@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ],
  providers: [
    AuthGuard
  ]
})
export class AppRoutingModule {

}
