import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnisysAngularSharedModule } from '../../shared/unisys-angular-shared.module';
import { ModalUpdateComponent } from './modal-update/modal-update.component';
import { AdminHelpComponent, } from './admin-help.component';
import { NgxPermissionsModule} from 'ngx-permissions';
import { AdminHelpRoutingModule } from './admin-help-routing.module';
import { TabsModule } from 'ngx-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    UnisysAngularSharedModule,
    AdminHelpRoutingModule,
    TabsModule,
    NgxPermissionsModule.forChild(),
  ],
  declarations: [
    AdminHelpComponent,
    ModalUpdateComponent,
  ],
  entryComponents: [
    ModalUpdateComponent,
  ],
})
export class AdminHelpModule {
}
