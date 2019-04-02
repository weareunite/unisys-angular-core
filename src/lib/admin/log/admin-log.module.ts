import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnisysAngularSharedModule } from '../../shared/unisys-angular-shared.module';
import { AdminLogComponent, } from './admin-log.component';
import { NgxPermissionsModule} from 'ngx-permissions';
import { AdminLogRoutingModule } from './admin-log-routing.module';
import { TabsModule } from 'ngx-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    UnisysAngularSharedModule,
    AdminLogRoutingModule,
    TabsModule,
    NgxPermissionsModule.forChild(),
  ],
  declarations: [
    AdminLogComponent,
  ],
})
export class AdminLogModule {
}
