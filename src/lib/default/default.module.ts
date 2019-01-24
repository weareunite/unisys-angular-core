import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DefaultComponent} from './default.component';
import {DefaultRoutingModule} from './default-routing.module';
import {ReactiveFormsModule} from '@angular/forms';
import {NgxPermissionsModule} from 'ngx-permissions';

@NgModule({
  imports: [
    CommonModule,
    DefaultRoutingModule,
    ReactiveFormsModule,
    NgxPermissionsModule.forChild(),
  ],
  declarations: [
    DefaultComponent,
  ],
  entryComponents: [],
})
export class DefaultModule {
}
