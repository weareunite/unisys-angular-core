import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UnisysAngularSharedModule} from '../../shared/unisys-angular-shared.module';
import {ModalUpdateComponent} from './modal-update/modal-update.component';
import {RoleComponent} from './role.component';
import {NgxPermissionsModule} from 'ngx-permissions';
import {AdminRoleRoutingModule} from './role-routing.module';
import {TabsModule} from 'ngx-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    UnisysAngularSharedModule,
    AdminRoleRoutingModule,
    TabsModule,
    NgxPermissionsModule.forChild(),
  ],
  declarations: [
    ModalUpdateComponent,
    RoleComponent
  ],
  entryComponents: [
    ModalUpdateComponent,
  ],
})
export class RoleModule {
}
