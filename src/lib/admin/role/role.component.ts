import {Component, OnInit} from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {MenuItem} from '../../models';
import {ModalUpdateComponent} from './modal-update/modal-update.component';
import {RoleService} from '../../services/role.service';
import {UnisysAngularAppStateServiceService} from '@weareunite/unisys-angular-app-state-service';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent implements OnInit {

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
    public      roleService: RoleService,
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

    this.actionList = [
      {
        translation: 'ADD_NEW_ROLE', permission: 'admin.role.create', visibility: true, action: function () {
          this.openModalCreate()
        }
      },
    ];

    this.selectedColumns = [
      {translation: 'ID', key: 'id', sortable: true, type: 'number'},
      {translation: 'NAME', key: 'name', sortable: true, type: 'string'},
      // {translation: 'GUARD_NAME', key: 'guard_name', sortable: false, type: 'string'},
      {
        translation: 'ACTION', key: 'action', sortable: false, type: 'action', options: [
          {
            translation: 'UPDATE_ITEM', permission: 'admin.role.update', visibility: true, action: function (item) {
              this.openModalEdit(item)
            }
          }
        ]
      },
    ];

    this.settings = {
      permission: 'admin.role',
      sortBy: 'id',
      visibleColumns: ['id', 'name', 'guard_name', 'action'],
      rowsOnPageOptions: [50, 100, 200],
      rowsOnPage: 50,
      activePage: 1,
    };
  }

  ngOnInit() {
  }

  public openModalCreate() {
    let initialState = {
      context: this.context,
      service: this.roleService,
    };
    this.bsModalRef = this.modalService.show(ModalUpdateComponent, {initialState, ignoreBackdropClick: true});
  }

  public openModalEdit(item) {
    let initialState = {
      context: this.context,
      item: item,
      service: this.roleService,
    };
    this.bsModalRef = this.modalService.show(ModalUpdateComponent, {initialState, ignoreBackdropClick: true});
  }

}
