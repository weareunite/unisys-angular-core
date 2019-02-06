import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ModalDeleteComponent } from './modal-delete/modal-delete.component';
import { ModalTagComponent } from './modal-tag/modal-tag.component';
import { Tag } from '../../models';
import { ModalTagDeleteComponent } from './modal-tag-delete/modal-tag-delete.component';
import { UnisysAngularAppStateServiceService } from '@weareunite/unisys-angular-app-state-service';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  @Input('columns') columns;
  @Input('settings') settings;
  @Input('context') context;
  @Input('service') service;
  @Input('tags') tags: boolean = false;

  private bsModalRef: BsModalRef;
  private subscription: Subscription;
  public data: any[];
  private selector: string;
  public stringLimit: number = 60;
  public plausiblePageRange: number = 3;

  constructor(
    private modalService: BsModalService,
    public appStateService: UnisysAngularAppStateServiceService,
    public translate: TranslateService,
    protected elem: ElementRef,
  ) {
    this.selector = elem.nativeElement.tagName.toLowerCase();
  }

  ngOnInit() {
    this.subscription = this.service.listChanged
      .subscribe(
        (list) => {
          this.data = list;
        }
      );

    this.appStateService.setComponentStateOrSetDefault(this.settings, this.selector);
    this.settings = this.appStateService.getViewState(this.selector);

    this.service
      .setPage(this.settings.activePage)
      .setLimit(this.settings.rowsOnPage)
      .setOrder(this.settings.sortBy)
      .setFilter()
      .setSearch();

    if (this.appStateService.getViewState('app-filter')) {
      this.service.setFilterByForm(this.appStateService.getViewState('app-filter'));
    }

    if (typeof this.service.setFiltersByViewState() == 'function') {
      this.service.setFiltersByViewState().getItemList();
    } else {
      this.service.getItemList();
    }
  }

  public setSorting(column) {
    if (column.sortable) {
      let sortBy = '';
      if (this.settings.sortBy == column.key) {
        sortBy = '-' + column.key;
      } else {
        sortBy = column.key;
      }
      this.settings.sortBy = sortBy;
      this.service.setOrder(this.settings.sortBy).getItemList();
      this.setTableState('sortBy', this.settings.sortBy);
    }
  }

  public setClass(item) {
    let desc: boolean = false;
    let classString = '';
    if (item.key == this.settings.sortBy.replace('-', '') || item.key == this.settings.sortBy) {
      classString = 'selected';
    }
    if (!this.settings.sortBy.includes('-')) {
      classString = classString + ' desc';
    }
    if (item.sortable) {
      classString = classString + ' hand';
    }
    return classString;
  }

  public clickAction(item, action) {
    this.setClicked(item);
    action.call(this.context, item);
  }

  public clickEvent(item, column) {
    this.setClicked(item);
    if (column.click) {
      column.click.call(this.context, item, column);
    }
  }

  public overEvent(item, column) {
    if (column.mouseover) {
      column.mouseover.call(this.context, item, column);
    }
  }

  public toggleVisibleColumn(key: string) {
    if (this.isColumnVisible(key)) {
      let index = this.settings.visibleColumns.indexOf(key);
      this.settings.visibleColumns.splice(index, 1);
    } else {
      this.settings.visibleColumns.push(key);
    }
    this.appStateService.setViewStateValue(this.settings.visibleColumns, this.selector + '.visibleColumns');
  }

  public isColumnVisible(key: string) {
    if (this.settings.visibleColumns.indexOf(key) > -1) {
      return true;
    }
    return false;
  }

  public drillColumnFromItem(item, key) {
    let valueToReturn;

    if (key.indexOf('.') > -1) {
      let array = key.split('.');
      if (item[array[0]] && array[1] && array[2] && array[3]) {
        valueToReturn = item[array[0]][array[1]][array[2]][array[3]];
      } else if (item[array[0]] && array[1] && array[2]) {
        valueToReturn = item[array[0]][array[1]][array[2]];
      } else if (item[array[0]] && array[1]) {
        valueToReturn = item[array[0]][array[1]];
      } else {
        valueToReturn = '';
      }
    } else {
      valueToReturn = item[key];

      if (valueToReturn.hasOwnProperty('value')) {
        valueToReturn = valueToReturn.value;
      }
    }

    return valueToReturn;
  }

  public getClass(item, column) {

    let valueToReturn: any = '';
    let valueClass = item[column.key];

    if (typeof valueClass !== 'undefined') {
      if (valueClass.hasOwnProperty('class')) {
        valueToReturn = valueClass['class'];
      }
    }

    return valueToReturn;
  }

  public getValue(item, column) {
    let valueToReturn: any = '';

    switch (column.type) {
      case 'date': {
        valueToReturn = this.transformDate(this.drillColumnFromItem(item, column.key), 'dd.MM.yyyy');
        break;
      }
      case 'progress': {
        valueToReturn = this.returnRatio(item, column.key);
        break;
      }
      case 'list_prop': {
        let splitedPath = column.key.split('/');
        let valueList = [];
        this.drillColumnFromItem(item, splitedPath[0]).forEach(function (entry, index) {
          valueList.push(this.drillColumnFromItem(entry, splitedPath[1]));
        }.bind(this));
        valueToReturn = valueList.join(',');
        break;
      }
      default: {
        valueToReturn = this.drillColumnFromItem(item, column.key);
      }
    }

    return valueToReturn;
  }

  transformToString(valueToReturn) {
    return String(valueToReturn);
  }

  transformDate(date, format: string) {
    if (date != '') {
      return formatDate(date, format, 'en-US', 'UTC+2');
    } else {
      return '';
    }
  }

  returnRatio(item, column: string) {
    let splitedPath = column.split('/');
    let leftPart = 0;
    let rightPart = 0;

    if (splitedPath[0].includes('-')) {
      let leftPartString = splitedPath[0].split('-');
      leftPart = this.drillColumnFromItem(item, leftPartString[0]) - this.drillColumnFromItem(item, leftPartString[1]);
    }
    if (splitedPath[0].includes('+')) {
      let leftPartString = splitedPath[0].split('+');
      leftPart = this.drillColumnFromItem(item, leftPartString[0]) + this.drillColumnFromItem(item, leftPartString[1]);
    } else {
      leftPart = this.drillColumnFromItem(item, splitedPath[0]);
    }

    if (splitedPath[1].includes('-')) {
      let rightPartString = splitedPath[1].split('-');
      rightPart = this.drillColumnFromItem(item, rightPartString[0]) - this.drillColumnFromItem(item, rightPartString[1]);
    } else if (splitedPath[1].includes('+')) {
      let rightPartString = splitedPath[1].split('+');
      rightPart = this.drillColumnFromItem(item, rightPartString[0]) + this.drillColumnFromItem(item, rightPartString[1]);
    } else {
      rightPart = this.drillColumnFromItem(item, splitedPath[1]);
    }
    return leftPart / rightPart;
  }

  public showCaret(options) {
    if (options != null) {
      let count = 0;
      options.forEach(function (entry, index) {
        if (entry.visibility === false) {
          count++;
        }
      });
      return count;
    } else {
      return 0;
    }
  }

  // set as clicked

  setClicked(item) {
    this.data.forEach(function (entry, index) {
      entry.clicked = false;
    });
    item.clicked = true;
  }

  // checkbox operations

  onCheckboxSelect(item) {
    if (item.selected == null) {
      item.selected = true;
    } else {
      item.selected = !item.selected;
    }
  }

  onSelectAll() {
    this.data.forEach(function (entry, index) {
      entry.selected = true;
    });
  }

  onUnselectAll() {
    this.data.forEach(function (entry, index) {
      entry.selected = false;
    });
  }

  checkSelectedCount() {
    if (this.data != null) {
      let count = 0;
      this.data.forEach(function (entry, index) {
        if (entry.selected === true) {
          count++;
        }
      });
      return count;
    } else {
      return 0;
    }
  }

  onOpenDeleteSelectedModal() {
    let initialState = {
      service: this.service,
    };
    this.bsModalRef = this.modalService.show(ModalDeleteComponent, {initialState, class: 'modal-sm'});
  }

  onOpenDeleteItemModal(item) {
    let initialState = {
      service: this.service,
      item: item,
    };
    this.bsModalRef = this.modalService.show(ModalDeleteComponent, {initialState, class: 'modal-sm'});
  }

//TAGS

  onOpenTagModal() {
    let initialState = {
      service: this.service,
    };
    this.bsModalRef = this.modalService.show(ModalTagComponent, {initialState, class: 'modal-sm'});
  }

  onOpenDeleteTagModal(item, tag: Tag) {
    let initialState = {
      service: this.service,
      item: item,
      tag: tag,
    };
    this.bsModalRef = this.modalService.show(ModalTagDeleteComponent, {initialState, class: 'modal-sm'});
  }

//EXPORT

  onExport() {
    let columnList = [];
    this.columns.forEach(function (entry, index, object) {
      if (this.isColumnVisible(entry.key) && (entry.key != 'has_attachments' && entry.key != 'action')) {
        this.translate.get(entry.translation).subscribe((res: string) => {
          columnList.push({
            header: res,
            key: entry.key,
          });
        });
      }
    }, this);
    this.service.getExport(columnList);
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
