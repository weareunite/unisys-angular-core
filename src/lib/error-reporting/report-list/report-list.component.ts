import { Component, OnInit } from '@angular/core';
import { ErrorReportService } from '../../services/error-report.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ModalReportDetailComponent } from '../modal-report-detail/modal-report-detail.component';

@Component({
  selector: 'lib-report-list',
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.scss']
})
export class ReportListComponent implements OnInit {

  public context;
  public settings;
  public selectedColumns;
  public actionList;
  private bsModalRef: BsModalRef;

  constructor(
    public modalService: BsModalService,
    public errorReportingService: ErrorReportService
  ) {
    this.context = this;

    this.settings = {
      permission: 'admin.users',
      sortBy: 'created_at',
      visibleColumns: ['id', 'created_at', 'detail'],
      rowsOnPageOptions: [50, 100, 200],
      rowsOnPage: 50,
      activePage: 1,
    };

    this.selectedColumns = [
      {translation: 'ID', key: 'id', sortable: true, type: 'number'},
      {translation: 'REPORT_DATE', key: 'created_at', sortable: true, type: 'datetime'},
      {translation: 'DETAIL', key: 'detail', sortable: false, type: 'detail'},
    ];
  }


  ngOnInit() {

  }

  openModalDetail(item) {
    let initialState = {
      context: this.context,
      service: this.errorReportingService,
      item: item
    };
    this.bsModalRef = this.modalService.show(ModalReportDetailComponent, {initialState, class: 'modal-lg'});
  }


}
