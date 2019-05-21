import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UnisysAngularSharedModule } from '../shared/unisys-angular-shared.module';
import { AdminUsersRoutingModule } from '../admin/users/users-routing.module';
import { NgxPermissionsModule } from 'ngx-permissions';
import { ModalReportErrorComponent } from './modal-report-error/modal-report-error.component';
import { ErrorReportingComponent } from './error-reporting.component';
import { TooltipModule } from 'ngx-bootstrap';
import { ReportListComponent } from './report-list/report-list.component';
import { ModalReportDetailComponent } from './modal-report-detail/modal-report-detail.component';
import { NgxJsonViewerModule } from 'ngx-json-viewer';

@NgModule({
  imports: [
    CommonModule,
    UnisysAngularSharedModule,
    AdminUsersRoutingModule,
    NgxPermissionsModule.forChild(),
    TooltipModule,
    NgxJsonViewerModule,
  ],
  declarations: [
    ModalReportDetailComponent,
    ModalReportErrorComponent,
    ErrorReportingComponent,
    ReportListComponent
  ],
  exports: [
    ErrorReportingComponent,
    ReportListComponent
  ],
  entryComponents: [
    ModalReportErrorComponent,
    ModalReportDetailComponent
  ]
})
export class ErrorReportingModule {
}
