import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {BsModalRef} from 'ngx-bootstrap';
import {BankAccount} from '../../../models';

@Component({
  selector: 'app-modal-edit',
  templateUrl: './modal-edit.component.html',
  styleUrls: ['./modal-edit.component.css']
})
export class ModalEditComponent implements OnInit {

  public item: BankAccount;
  private service;

  defaultForm = new FormGroup({
    name: new FormControl(),
    short_name: new FormControl(),
    type: new FormControl(),
    iban: new FormControl(),
    swift: new FormControl(),
  });

  constructor(
    public bsModalRef: BsModalRef,
    public formBuilder: FormBuilder,
  ) {
  }

  ngOnInit() {
    this.builForm();
  }

  private builForm() {
    if (this.item) {
      this.defaultForm = this.formBuilder.group({
        id: [this.item.id],
        name: [this.item.name, Validators.required],
        short_name: [this.item.short_name, Validators.required],
        type: [this.item.type, Validators.required],
        iban: [this.item.iban, Validators.required],
        swift: [this.item.swift, Validators.required],
      });
    } else {
      this.defaultForm = this.formBuilder.group({
        id: '',
        name: ['', Validators.required],
        short_name: ['', Validators.required],
        type: ['', Validators.required],
        iban: ['', Validators.required],
        swift: ['', Validators.required],
      });
    }

  }

  public onSubmit() {
    if (this.item) {
      this.update();
    } else {
      this.create();
    }
    this.bsModalRef.hide();
  }

  public update() {
    this.service.updateBankAccountFromList(this.defaultForm.value);
  }

  public create() {
    let itemSubscription = this.service.itemChanged
      .subscribe(
        (item) => {
          this.item = item;
          this.builForm();
          itemSubscription.unsubscribe();
        }
      );
    this.service.pushBankAccountToList(this.defaultForm.value);
  }

}
