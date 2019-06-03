import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstanceManagerComponent } from './instance-manager.component';
import {UnisysAngularSharedModule} from '../../shared/unisys-angular-shared.module';

@NgModule({
  declarations: [InstanceManagerComponent],
  exports: [
    InstanceManagerComponent
  ],
  imports: [
    CommonModule,
    UnisysAngularSharedModule
  ]
})
export class InstanceManagerModule { }
