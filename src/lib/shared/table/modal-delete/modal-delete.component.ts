import { Component, OnInit } from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap';

@Component({
  selector: 'app-modal-delete',
  templateUrl: './modal-delete.component.html',
  styleUrls: ['./modal-delete.component.css']
})
export class ModalDeleteComponent implements OnInit {
  private service;
  public item;

  constructor(
      public bsModalRef: BsModalRef,
  ) { }

  ngOnInit() {
  }

  deleteSelected(){
    this.service.deleteSelected();
    this.bsModalRef.hide();
  }

  deleteItem(){
    this.service.deleteItemFromList(this.item);
    this.bsModalRef.hide();
  }

}
