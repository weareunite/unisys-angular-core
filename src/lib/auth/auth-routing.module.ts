import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuickLoginComponent } from './quick-login/quick-login.component';
import { SinginComponent } from './singin/singin.component';

const authRoutes: Routes = [
  {path: 'quick-login', component: QuickLoginComponent},
  {path: 'signin', component: SinginComponent}
];

@NgModule({
  imports: [
    RouterModule.forChild(authRoutes)
  ],
  exports: [RouterModule]
})
export class AuthRoutingModule {
}
