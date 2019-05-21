import { Component, OnInit } from '@angular/core';
import { ErrorReportService } from '../services/error-report.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ModalReportErrorComponent } from './modal-report-error/modal-report-error.component';

@Component({
  selector: 'lib-error-reporting',
  templateUrl: './error-reporting.component.html',
  styleUrls: ['./error-reporting.component.scss']
})
export class ErrorReportingComponent implements OnInit {

  private bsModalRef: BsModalRef;
  public context;

  constructor(
    public defaultService: ErrorReportService,
    public modalService: BsModalService
  ) {
    this.context = this;
  }

  ngOnInit() {
    let logBackup = console.log;

    console.log = function () {

      let consoleData = {
        console: console,
        args: arguments
      };

      this.defaultService.pushIntoConsoleLog(consoleData);
      logBackup.apply(console, arguments);
    }.bind(this);
  }

  openErrorReportModal() {
    let initialState = {
      context: this.context,
      service: this.defaultService
    };
    this.bsModalRef = this.modalService.show(ModalReportErrorComponent, {initialState});
  }

}
