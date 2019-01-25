import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SinginComponent } from './singin/singin.component';
import { QuickLoginComponent } from './quick-login/quick-login.component';
import { AuthRoutingModule } from './auth-routing.module';

@NgModule({
  declarations: [
      SinginComponent,
      QuickLoginComponent,
  ],
  imports: [
      FormsModule,
      AuthRoutingModule
  ]
})
export class AuthModule { }
