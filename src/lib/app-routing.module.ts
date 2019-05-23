import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './services/auth-guard.service';

const appRoutes: Routes = [
  {path: '', redirectTo: 'default', pathMatch: 'full'},
  {path: 'app', redirectTo: 'default', pathMatch: 'full'},
  {path: 'default', redirectTo: 'admin/products', pathMatch: 'full'},
  {path: 'admin/roles', loadChildren: () => import('./admin/role/role.module').then(m => m.RoleModule)},
  {path: 'admin/settings', loadChildren: () => import('./admin/settings/settings.module').then(m => m.SettingsModule)},
  {path: 'admin/user', loadChildren: () => import('./admin/users/users.module').then(m => m.UsersModule)},
  {path: 'admin/help', loadChildren: () => import('./admin/help/admin-help.module').then(m => m.AdminHelpModule)},
  {path: 'admin/logs', loadChildren: () => import('./admin/log/admin-log.module').then(m => m.AdminLogModule)},
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
