import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { UnisysAngularAppStateServiceService } from '@weareunite/unisys-angular-app-state-service';
import { ActivityLogDetailService } from '../../services/activity-log-detail.service';

@Component({
  selector: 'lib-log-view',
  templateUrl: './log-view.component.html',
  styleUrls: ['./log-view.component.scss']
})
export class LogViewComponent implements OnInit {
  @Input('subjectId') subjectId;
  @Input('subjectType') subjectType;
  @Input('context') context;
  @Input('customClass') customClass: string = 'col-sm-12';

  private subscription: Subscription;
  public data: any[];
  private selector: string;
  public plausiblePageRange: number = 3;
  public settings;

  constructor(
    public appStateService: UnisysAngularAppStateServiceService,
    public translate: TranslateService,
    public service: ActivityLogDetailService,
    protected elem: ElementRef,
  ) {
    this.selector = elem.nativeElement.tagName.toLowerCase();
    this.settings = {
      permission: 'admin.log',
      sortBy: '-id',
      rowsOnPageOptions: [50, 100, 200],
      rowsOnPage: 50,
      activePage: 1,
    };
  }

  ngOnInit() {
    this.subscription = this.service.listChanged
      .subscribe(
        (list) => {
          console.log(list);
          this.data = list;
        }
      );

    this.appStateService.setComponentStateOrSetDefault(this.settings, this.selector);

    this.service
        .setPage(this.settings.activePage)
        .setLimit(this.settings.rowsOnPage)
        .setOrder(this.settings.sortBy)
        .setFilter('subject_type', this.subjectType)
        .setFilter('subject_id', this.subjectId)
        .setSearch();

    this.service.getItemList();
  }

  // HELPERS

  parseString(string){
    return JSON.parse(string);
  }

  //PAGINATION

  setFirstPage() {
    this.service.setPage(1);
    this.service.getItemList();
    this.setTableState('activePage', 1);
  }

  setPrevPage() {
    this.service.page - 1 > 0 && this.service.setPage(this.service.page - 1);
    this.setTableState('activePage', 1);
    this.service.getItemList();
  }

  setPage(page: number) {
    this.service.setPage(page);
    this.setTableState('activePage', page);
    this.service.getItemList();
  }

  setNextPage() {
    let lastPage = this.service.pageList[this.service.pageList.length - 1];
    this.service.page < lastPage && this.service.setPage(this.service.page + 1);
    this.setTableState('activePage', this.service.page + 1);
    this.service.getItemList();
  }

  setLastPage() {
    let lastPage = this.service.pageList[this.service.pageList.length - 1];
    this.service.setPage(lastPage);
    this.service.getItemList();
    this.setTableState('activePage', lastPage);
  }

  setPageSize(size: number) {
    this.service.setLimit(size);
    this.service.getItemList();
    this.setTableState(size, 'rowsOnPage');
  }

  showPageAsOption(page: number) {
    if (this.service.page - this.plausiblePageRange < page && page < this.service.page + this.plausiblePageRange) {
      return true;
    }
    return false;
  }

  showDotsAtBegin() {
    if (this.service.pageList[this.plausiblePageRange] <= this.service.page) {
      return true;
    }
    return false;
  }

  showDotsAtEnd() {
    if (this.service.pageList[this.service.pageList.length - this.plausiblePageRange - 1] >= this.service.page) {
      return true;
    }
    return false;
  }

// App state

  setTableState(option, value) {
    this.appStateService.setViewStateValue(value, this.selector + '.' + option);
  }

}
