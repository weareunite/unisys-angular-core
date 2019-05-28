import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NgxPermissionsGuard} from 'ngx-permissions';

import {AuthGuard} from '../../services/auth-guard.service';
import {RoleComponent} from './role.component';

const adminRoleRoutes: Routes = [
  {
    path: 'role', component: RoleComponent,
    children: [
      {
        path: 'role', component: RoleComponent, canActivate: [NgxPermissionsGuard, AuthGuard],
        data: {permissions: {only: ['admin.role'], redirectTo: ''}}
      },
    ]
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(adminRoleRoutes)
  ],
  exports: [RouterModule]
})
export class AdminRoleRoutingModule {
}
