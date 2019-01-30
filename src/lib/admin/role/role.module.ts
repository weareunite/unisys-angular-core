import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../shared/shared.module';
import {ModalUpdateComponent} from './modal-update/modal-update.component';
import {RoleComponent} from './role.component';
import {NgxPermissionsModule} from 'ngx-permissions';
import {AdminRoleRoutingModule} from './role-routing.module';
import {TabsModule} from 'ngx-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
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
