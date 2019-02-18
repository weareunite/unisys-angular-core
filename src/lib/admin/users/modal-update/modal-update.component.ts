import {Component, OnInit} from '@angular/core';
import {User} from '../../../models';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {BsModalRef} from 'ngx-bootstrap';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-modal-update',
  templateUrl: './modal-update.component.html',
  styleUrls: ['./modal-update.component.css']
})
export class ModalUpdateComponent implements OnInit {

  public item: User;
  public service;
  public roleList: any[];
  public roleSubscription: Subscription;

  defaultForm = new FormGroup({
    id: new FormControl(),
    name: new FormControl(),
    surname: new FormControl(),
    username: new FormControl(),
    email: new FormControl(),
    password: new FormControl(),
    password_confirmation: new FormControl(),
    roles: new FormControl(),
  });

  constructor(
    public bsModalRef: BsModalRef,
    public formBuilder: FormBuilder,
  ) {
  }

  ngOnInit() {
    this.builForm();
    this.roleSubscription = this.service.roleListChanged
      .subscribe(
        (list) => {
          this.roleList = list;
        }
      );
    this.service.getRoles();
  }

  private builForm() {
    if (this.item) {
      this.defaultForm = this.formBuilder.group({
        id: [this.item.id],
        name: [this.item.name, Validators.required],
        surname: [this.item.surname, Validators.required],
        username: [this.item.username, Validators.required],
        email: [this.item.email, Validators.required],
        password: ['',],
        password_confirmation: [''],
        // roles: [this.item.roles, Validators.required],
      });
    } else {
      this.defaultForm = this.formBuilder.group({
        id: '',
        name: ['', Validators.required],
        surname: ['', Validators.required],
        username: ['', Validators.required],
        email: ['', Validators.required],
        password: ['', Validators.required],
        password_confirmation: ['', Validators.required],
        // roles: ['', Validators.required],
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
    this.service.updateUserFromList(this.defaultForm.value);
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
    this.service.pushUserToList(this.defaultForm.value);
  }

}
