import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnisysAngularSharedModule } from '../../shared/unisys-angular-shared.module';
import { AdminLogComponent, } from './admin-log.component';
import { NgxPermissionsModule } from 'ngx-permissions';
import { AdminLogRoutingModule } from './admin-log-routing.module';
import { TabsModule } from 'ngx-bootstrap';
import { ModalViewComponent } from './modal-view/modal-view.component';
import { FilterComponent } from './filter/filter.component';

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
        ModalViewComponent,
        FilterComponent,
    ],
    entryComponents: [
        ModalViewComponent,
    ]
})
export class AdminLogModule {
}
