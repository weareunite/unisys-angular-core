import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';

import { AuthGuard } from '../../services/auth-guard.service';
import { AdminHelpComponent } from './admin-help.component';

const adminHelpRoutes: Routes = [
  {
    path: '', component: AdminHelpComponent,
    children: [
      {
        path: '', component: AdminHelpComponent, canActivate: [NgxPermissionsGuard, AuthGuard],
        data: {permissions: {only: ['admin.help'], redirectTo: ''}}
      },
    ]
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(adminHelpRoutes)
  ],
  exports: [RouterModule]
})
export class AdminHelpRoutingModule {
}
