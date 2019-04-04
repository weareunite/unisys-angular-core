import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { MenuItem } from '../../models';
import { UnisysAngularAppStateServiceService } from '@weareunite/unisys-angular-app-state-service';
import { ActivityLogService } from '../../services/activity-log.service';
import { LogEverywhereComponent } from '../../log-everywhere/log-everywhere.component';
import { ModalViewComponent } from './modal-view/modal-view.component';

@Component({
    selector: 'lib-app-admin-log',
    templateUrl: './admin-log.component.html',
    styleUrls: ['./admin-log.component.css']
})
export class AdminLogComponent implements OnInit{

    public selectedColumns;
    public item;
    public context;
    public settings;
    public mainMenu: MenuItem[];
    private bsModalRef: BsModalRef;
    public actionList;
    public service;

    constructor(
        public      activityLogService: ActivityLogService,
        protected   appStateService: UnisysAngularAppStateServiceService,
        private     modalService: BsModalService,
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
            {translation: 'SUBJECT_ID', key: 'subject_id', sortable: true, type: 'string'},
            {translation: 'CAUSER_ID', key: 'causer_id', sortable: true, type: 'string'},
            {
                translation: 'ACTION', key: 'id', sortable: false, type: 'action', options: [
                    {
                        translation: 'Open', permission: 'admin.help.update', visibility: true, action: function(item){
                            this.openModalView(item);
                        }
                    }
                ]
            },
        ];

        this.settings = {
            permission: 'admin.log',
            sortBy: '-id',
            visibleColumns: ['id', 'created_at', 'description', 'subject_type', 'subject_id', 'causer_id'],
            rowsOnPageOptions: [50, 100, 200],
            rowsOnPage: 50,
            activePage: 1,
        };
    }

    ngOnInit() {
    }

    public openModalView(item) {
        const initialState = {
            item: item,
        };
        this.bsModalRef = this.modalService.show(ModalViewComponent, {initialState});
    }


}
