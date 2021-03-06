import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgxPermissionsGuard } from 'ngx-permissions';
import { DefaultComponent } from './default.component';
import { AuthGuard } from '../services/auth-guard.service';

const defaultRoutes: Routes = [
  {
    path: 'admin', component: DefaultComponent, children: [
      {
        path: 'default', component: DefaultComponent, canActivate: [NgxPermissionsGuard, AuthGuard],
        data: {
          permissions: {
            only: ['default'],
            redirectTo: ''
          }
        }
      },
    ]
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(defaultRoutes)
  ],
  exports: [RouterModule]
})
export class DefaultRoutingModule {

}
