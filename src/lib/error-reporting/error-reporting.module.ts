import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnisysAngularSharedModule } from '../shared/unisys-angular-shared.module';
import { AdminUsersRoutingModule } from '../admin/users/users-routing.module';
import { NgxPermissionsModule } from 'ngx-permissions';
import { ModalReportErrorComponent } from './modal-report-error/modal-report-error.component';
import { ErrorReportingComponent } from './error-reporting.component';
import { TooltipModule } from 'ngx-bootstrap';

@NgModule({
    imports: [
        CommonModule,
        UnisysAngularSharedModule,
        AdminUsersRoutingModule,
        NgxPermissionsModule.forChild(),
        TooltipModule,
    ],
    declarations: [
        ModalReportErrorComponent,
        ErrorReportingComponent
    ],
    exports: [
        ErrorReportingComponent
    ],
    entryComponents: [
        ModalReportErrorComponent
    ]
})
export class ErrorReportingModule {
}
