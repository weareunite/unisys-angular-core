import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AdminUsersRoutingModule} from './users-routing.module';
import {UnisysAngularSharedModule} from '../../shared/unisys-angular-shared.module';
import {ModalUpdateComponent} from './modal-update/modal-update.component';
import {UsersComponent} from './users.component';
import {NgxPermissionsModule} from 'ngx-permissions';

@NgModule({
  imports: [
    CommonModule,
    UnisysAngularSharedModule,
    AdminUsersRoutingModule,
    NgxPermissionsModule.forChild(),
  ],
  declarations: [
    ModalUpdateComponent,
    UsersComponent
  ],
  entryComponents: [
    ModalUpdateComponent,
  ],
})
export class UsersModule {
}
