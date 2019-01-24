import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UnisysAngularTabRouterModule} from '@weareunite/unisys-angular-tab-router';

@NgModule({
  imports: [
    CommonModule,
    UnisysAngularTabRouterModule
  ],
  declarations: [],
  exports: [
    CommonModule,
    UnisysAngularTabRouterModule
  ],
  entryComponents: [],
})
export class SharedModule {
  constructor() {


  }
}
