import { Component, OnInit } from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap';

@Component({
  selector: 'app-modal-tag-delete',
  templateUrl: './modal-tag-delete.component.html',
  styleUrls: ['./modal-tag-delete.component.css']
})
export class ModalTagDeleteComponent implements OnInit {

    private service;
    public item;
    public tag;

    constructor(
        public bsModalRef: BsModalRef,
    ) { }

    ngOnInit() {
    }

    deleteItem(){
        this.service.detachTag(this.item,this.tag);
        this.bsModalRef.hide();
    }

}
