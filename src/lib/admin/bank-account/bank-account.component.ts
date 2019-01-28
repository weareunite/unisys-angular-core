import { Component, OnInit } from '@angular/core';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {MenuItem} from '../../models';
import {BankAccountService} from '../../services/bank-account.service';
import {ModalEditComponent} from './modal-edit/modal-edit.component';
import {AppStateService} from '../../services/app-state.service';

@Component({
  selector: 'app-bank-account',
  templateUrl: './bank-account.component.html',
  styleUrls: ['./bank-account.component.css']
})
export class BankAccountComponent implements OnInit {
    public  context;
    public  item;
    private bsModalRef: BsModalRef;
    public  mainMenu:MenuItem[];
    public  settings;
    public  actionList;
    public  selectedColumns;


    constructor(
        private modalService: BsModalService,
        public  bankAccountService : BankAccountService,
        public  appStateService : AppStateService,
    ) {
        this.context = this;
        this.mainMenu = [
            {routerLink:['/admin','bank-account'], permission:'admin.bank-account',translation:'BANK_ACCOUNTS',icon:''},
            {routerLink:['/admin','tags'], permission:'admin.tags',translation:'TAGS',icon:''},
            {routerLink:['/admin','category'], permission:'admin.category',translation:'CATEGORIES',icon:''},
            {routerLink:['/admin','user'], permission:'admin.users',translation:'USERS',icon:''},
            {routerLink:['/admin','settings'], permission:'admin.settings',translation:'APP_SETTINGS',icon:''},
        ];

        this.actionList = [
            {translation:'ADD_NEW_BANK_ACCOUNT', permission:'admin.bank-account.create',visibility:true,  action: function (){this.openModalCreate()}},
        ];

        this. selectedColumns = [
            {translation:'ID',          key:'id',           sortable:true,  type:'number'},
            {translation:'NAME',        key:'name',         sortable:true,  type:'string'},
            {translation:'SHORT_NAME',  key:'short_name',   sortable:true,  type:'number'},
            {translation:'BALANCE',     key:'balance',      sortable:true,  type:'number'},
            {translation:'IBAN',        key:'iban',         sortable:true,  type:'string'},
            {translation:'ACTION',      key:'action',       sortable:false, type:'action', options:[
                {translation:'UPDATE_ITEM', permission:'admin.bank-account.update' , visibility:true, action: function (item){this.openModalEdit(item)}},
            ]
            },
        ];

        this.settings = {
            permission:'bank-account',
            sortBy:'name',
            visibleColumns: ['id','name','short_name','balance','action'],
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
            service: this.bankAccountService,
        };
        this.bsModalRef = this.modalService.show(ModalEditComponent,{initialState});
    }

    public openModalEdit(item){
        let initialState = {
            context : this.context,
            item: item,
            service: this.bankAccountService,
        };
        this.bsModalRef = this.modalService.show(ModalEditComponent,{initialState});
    }
}
