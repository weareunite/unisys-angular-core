import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './services/auth-guard.service';

const appRoutes: Routes = [
  {path: '', redirectTo: 'default', pathMatch: 'full'},
  {path: 'app', redirectTo: 'default', pathMatch: 'full'},
  {path: 'default', redirectTo: 'admin/products', pathMatch: 'full'},
  {path: 'admin/roles', loadChildren: './admin/role/role.module#RoleModule'},
  {path: 'admin/settings', loadChildren: './admin/settings/settings.module#SettingsModule'},
  {path: 'admin/user', loadChildren: './admin/users/users.module#UsersModule'},
  {path: 'admin/help', loadChildren: './admin/help/admin-help.module#AdminHelpModule'},
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
