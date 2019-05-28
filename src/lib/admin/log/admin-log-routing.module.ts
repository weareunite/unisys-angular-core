import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';

import { AuthGuard } from '../../services/auth-guard.service';
import { AdminLogComponent } from './admin-log.component';

const adminLogRoutes: Routes = [
  {
    path: '', component: AdminLogComponent,
    children: [
      {
        path: 'log', component: AdminLogComponent, canActivate: [NgxPermissionsGuard, AuthGuard],
        data: {permissions: {only: ['admin.log'], redirectTo: ''}}
      },
    ]
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(adminLogRoutes)
  ],
  exports: [RouterModule]
})
export class AdminLogRoutingModule {
}
