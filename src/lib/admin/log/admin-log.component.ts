import {Component, OnInit} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {MenuItem} from '../../models';
import {UnisysAngularAppStateServiceService} from '@weareunite/unisys-angular-app-state-service';
import { ActivityLogService } from '../../services/activity-log.service';

@Component({
  selector: 'lib-app-admin-log',
  templateUrl: './admin-log.component.html',
  styleUrls: ['./admin-log.component.css']
})
export class AdminLogComponent implements OnInit {

  public selectedColumns;
  public item;
  public context;
  public settings;
  public mainMenu: MenuItem[];
  private bsModalRef: BsModalRef;
  public actionList;
  public service;

  constructor(
    private     modalService: BsModalService,
    public      activityLogService: ActivityLogService,
    protected   appStateService: UnisysAngularAppStateServiceService,
  ) {
    this.context = this;
    this.mainMenu = [
      {routerLink: ['/admin', 'user'], permission: 'admin.users', translation: 'USERS', icon: ''},
      {routerLink: ['/admin', 'roles'], permission: 'admin.role', translation: 'ROLES', icon: ''},
      {routerLink: ['/admin', 'help'], permission: 'admin.help', translation: 'HELP', icon: ''},
      {routerLink: ['/admin', 'settings'], permission: 'admin.settings', translation: 'APP_SETTINGS', icon: ''},
      {routerLink: ['/admin', 'logs'], permission: 'admin.log', translation: 'APP_LOGS', icon: ''},
    ];

    this.selectedColumns = [
      {translation: 'ID', key: 'id', sortable: true, type: 'number'},
      {translation: 'CREATED_AT', key: 'created_at', sortable: true, type: 'number'},
      {translation: 'DESCRIPTION', key: 'description', sortable: true, type: 'string'},
      {translation: 'SUBJECT_TYPE', key: 'subject_type', sortable: true, type: 'string'},
      {
        translation: 'ACTION', key: 'id', sortable: false, type: 'action', options: [
          {
            translation: 'UPDATE_ITEM', permission: 'admin.help.update', visibility: true, action: function (item) {
              // this.openModalEdit(item);
            }
          }
        ]
      },
    ];

    this.settings = {
      permission: 'admin.log',
      sortBy: 'id',
      visibleColumns: ['id', 'created_at', 'description', 'subject_type'],
      rowsOnPageOptions: [50, 100, 200],
      rowsOnPage: 50,
      activePage: 1,
    };
  }

  ngOnInit() {
  }
}
