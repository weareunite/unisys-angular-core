import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DefaultComponent} from './default.component';
import {DefaultRoutingModule} from './default-routing.module';
import {SharedModule} from '../shared/shared.module';
import {ReactiveFormsModule} from '@angular/forms';
import {NgxPermissionsModule} from 'ngx-permissions';
import {UnisysAngularTabRouterModule} from '@weareunite/unisys-angular-tab-router';

@NgModule({
  imports: [
    CommonModule,
    DefaultRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    NgxPermissionsModule.forChild(),
    UnisysAngularTabRouterModule
  ],
  exports: [
    UnisysAngularTabRouterModule
  ],
  declarations: [
    DefaultComponent,
  ],
  entryComponents: [],
})
export class DefaultModule {
}
