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
      permission: 'admin.error-reports',
      sortBy: 'created_at',
      visibleColumns: ['id', 'created_at', 'detail', 'user', 'content'],
      rowsOnPageOptions: [50, 100, 200],
      rowsOnPage: 50,
      activePage: 1,
    };

    this.selectedColumns = [
      {translation: 'ID', key: 'id', sortable: true, type: 'number'},
      {translation: 'USER', key: 'content', sortable: false ,type: 'json', json: true, jsonPointer: ['application', 'user','username'], count:false},
      {translation: 'EMAIL', key: 'content', sortable: false, type: 'json', json: true, jsonPointer: ['application', 'user','email'],count:false},
      {translation: 'IP_ADDRESS', key: 'content', sortable: false, type: 'json', json: true, jsonPointer: ['application', 'network','ip'],count:false},
      {translation: 'URL', key: 'content', sortable: false, type: 'json', json: true, jsonPointer: ['application', 'url'],count:false},
      {translation: 'BROWSER', key: 'content', sortable: false, type: 'json', json: true, jsonPointer: ['browser', 'browser'],count:false},
      {translation: 'VERSION', key: 'content', sortable: false, type: 'json', json: true, jsonPointer: ['browser', 'version'],count:false},
      {translation: 'GRAPHQL_CALLS', key: 'content', sortable: false, type: 'json', json: true, jsonPointer: ['application', 'latestCalls'],count:true},
      {translation: 'REST_CALLS', key: 'content', sortable: false, type: 'json', json: true, jsonPointer: ['application', 'restCalls'],count:true},
      {translation: 'CONSOLE', key: 'content', sortable: false, type: 'json', json: true, jsonPointer: ['application', 'console'],count:true},
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
