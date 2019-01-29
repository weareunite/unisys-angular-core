import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import {MenuItem} from '../../models';
import { ModalUpdateComponent } from './modal-update/modal-update.component';
import { UserService } from '../../services/user.service';
import {AppStateService} from '../../services/app-state.service';

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
    public  mainMenu:MenuItem[];
    public  settings;
    public  actionList;
    public  selectedColumns;

    constructor(
        public modalService: BsModalService,
        public userService : UserService,
        public appStateService : AppStateService,
    ) {
        this.context = this;
        this.mainMenu = [
            {routerLink:['/admin','bank-account'], permission:'admin.bank-account',translation:'BANK_ACCOUNTS',icon:''},
            // {routerLink:['/admin','tags'], permission:'admin.tags',translation:'TAGS',icon:''},
            // {routerLink:['/admin','category'], permission:'admin.category',translation:'CATEGORIES',icon:''},
            {routerLink:['/admin','user'], permission:'admin.users',translation:'USERS',icon:''},
            {routerLink:['/admin','settings'], permission:'admin.settings',translation:'APP_SETTINGS',icon:''},
        ];

        this.actionList = [
            {translation:'ADD_NEW_USER', permission:'admin.users.create', visibility:true,  action: function (){this.openModalCreate()}},
        ];

        this. selectedColumns = [
            {translation:'ID',          key:'id',           sortable:true,  type:'number'},
            {translation:'NANE',        key:'name',         sortable:true,  type:'string'},
            {translation:'SURNAME',     key:'surname',      sortable:true,  type:'string'},
            {translation:'USERNAME',    key:'username',     sortable:true,  type:'string'},
            {translation:'ACTION',      key:'action',       sortable:false, type:'action', options:[
                {translation:'UPDATE_ITEM', permission:'admin.users.update', visibility:true, action: function (item){this.openModalEdit(item)}},
            ]
            },
        ];

        this.settings = {
            permission:'users',
            sortBy:'name',
            visibleColumns: ['id','name','surname','username','action'],
            rowsOnPageOptions: [50,100,200],
            rowsOnPage: 50,
            activePage:1,
        };
    }

    ngOnInit() {
    }

    public openModalCreate(){
        let initialState = {
            context : this.context,
            service: this.userService,
        };
        this.bsModalRef = this.modalService.show(ModalUpdateComponent,{initialState});
    }

    public openModalEdit(item){
        let initialState = {
            context : this.context,
            item: item,
            service: this.userService,
        };
        this.bsModalRef = this.modalService.show(ModalUpdateComponent,{initialState});
    }
}
