import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { MenuItem } from '../../models';
import { ModalUpdateComponent } from './modal-update/modal-update.component';
import { UserService } from '../../services/user.service';
import { UnisysAngularAppStateServiceService } from '@weareunite/unisys-angular-app-state-service';
import { Subscription } from 'rxjs';
import { ApolloService } from '../../services/apollo.service';
import { BulkService } from '../../services/bulk.service';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

    public data;
    public context;
    public item;
    private bsModalRef: BsModalRef;
    public mainMenu: MenuItem[];
    public settings;
    public actionList;
    public selectedColumns;

    constructor(
        public modalService: BsModalService,
        public userService: UserService,
        public appStateService: UnisysAngularAppStateServiceService,
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
                translation: 'ADD_NEW_USER', permission: 'admin.users.create', visibility: true, action: function () {
                    this.openModalCreate();
                }
            },
        ];

        this.selectedColumns = [
            {translation: 'ID', key: 'id', sortable: true, type: 'number'},
            {translation: 'FIRST_NAME', key: 'name', sortable: true, type: 'string'},
            {translation: 'SURNAME', key: 'surname', sortable: true, type: 'string'},
            {translation: 'USERNAME', key: 'username', sortable: true, type: 'string'},
            {translation: 'ACTIVE', key: 'active', sortable: true, type: 'boolean'},
            {
                translation: 'ACTION', key: 'action', sortable: false, type: 'action', options: [
                    {
                        translation: 'UPDATE_ITEM', permission: 'admin.users.update', visibility: true, action: function (item) {
                            this.openModalEdit(item);
                        }
                    },
                ]
            },
        ];

        this.settings = {
            permission: 'admin.users',
            sortBy: 'name',
            visibleColumns: ['id', 'name', 'surname', 'username', 'active', 'action'],
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
            service: this.userService,
        };
        this.bsModalRef = this.modalService.show(ModalUpdateComponent, {initialState, ignoreBackdropClick: true});
    }

    public openModalEdit(item) {
        let initialState = {
            context: this.context,
            item: item,
            service: this.userService,
        };
        this.bsModalRef = this.modalService.show(ModalUpdateComponent, {initialState, ignoreBackdropClick: true});
    }
}
