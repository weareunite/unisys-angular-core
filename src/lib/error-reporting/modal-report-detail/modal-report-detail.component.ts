import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { browser } from 'protractor';

@Component({
  selector: 'lib-modal-report-error',
  templateUrl: './modal-report-detail.component.html',
  styleUrls: ['./modal-report-detail.component.scss']
})
export class ModalReportDetailComponent implements OnInit {

  public item;
  public browser;
  public application;
  public datetime;
  public issue;
  public localStorage;
  public permissions;
  public viewState;

  constructor(
    public bsModalRef: BsModalRef,
  ) {
  }

  ngOnInit() {
    let parsedData = JSON.parse(this.item.content);
    this.browser = parsedData.browser;
    this.application = parsedData.application;
    this.datetime = parsedData.datetime;
    this.issue = parsedData.issue;
    this.localStorage = parsedData.localStorage;
    this.permissions = JSON.parse(this.localStorage.permissions);
    this.viewState = JSON.parse(this.localStorage.viewState);
  }


}
