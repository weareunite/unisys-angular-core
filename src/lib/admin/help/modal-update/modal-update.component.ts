import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {BsModalRef} from 'ngx-bootstrap';
import { Help, Role } from '../../../models';
import {Subscription} from 'rxjs';
import {PermissionService} from '../../../services/permission.service';

@Component({
  selector: 'app-modal-update',
  templateUrl: './modal-update.component.html',
  styleUrls: ['./modal-update.component.scss']
})
export class ModalUpdateComponent implements OnInit {

  public item: Help;
  private service;
  public permissionsListSubscription: Subscription;
  public allPermissionsListSubscription: Subscription;

  defaultForm = new FormGroup({
    id: new FormControl(),
    name: new FormControl(),
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
        url: [this.item.url, Validators.required],
        content: [this.item.content],
      });

    } else {
      this.defaultForm = this.formBuilder.group({
        name: ['', Validators.required],
        url: ['', Validators.required],
        content: [''],
      });
    }
  }

  public onSubmit() {
    if (this.item) {
      this.update();
    } else {
      this.create();
    }
    const listSubscription = this.service.listChanged
        .subscribe(
            (listChanged) => {
              this.bsModalRef.hide();
              listSubscription.unsubscribe();
            }
        );
  }

  public update() {
    this.service.updateItemFromList(this.defaultForm.value, this.defaultForm.value);
  }

  public create() {
    const itemSubscription = this.service.itemChanged
        .subscribe(
            (item) => {
              this.item = item;
              this.builForm();
              itemSubscription.unsubscribe();
            }
        );
    this.service.pushItemToList(this.defaultForm.value, true);
  }

}
