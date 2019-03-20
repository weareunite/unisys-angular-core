import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {BsModalRef} from 'ngx-bootstrap';
import {Role} from '../../../models';
import {Subscription} from 'rxjs';
import {PermissionService} from '../../../services/permission.service';

@Component({
  selector: 'app-modal-update',
  templateUrl: './modal-update.component.html',
  styleUrls: ['./modal-update.component.scss']
})
export class ModalUpdateComponent implements OnInit {

  public item: Role;
  private service;
  public permissionsListSubscription: Subscription;
  public allPermissionsListSubscription: Subscription;

  defaultForm = new FormGroup({
    name: new FormControl(),
    frontendPermissions: new FormGroup({}),
    apiPermissions: new FormGroup({}),
  });

  constructor(
    public bsModalRef: BsModalRef,
    public formBuilder: FormBuilder,
    public permissionService: PermissionService,
  ) {
  }

  ngOnInit() {

    this.builForm();

    this.permissionsListSubscription = this.service.permissionsChanged
      .subscribe(
        (item) => {
          this.item = item;
          this.pushListToForm('frontendPermissions', this.item.frontendPermissions);
          this.pushListToForm('apiPermissions', this.item.apiPermissions);

          this.setValueOfGroup('frontendPermissions', this.item.frontendPermissions, true);
          this.setValueOfGroup('apiPermissions', this.item.apiPermissions, true);
        }
      );

    this.allPermissionsListSubscription = this.permissionService.permissionsChanged
      .subscribe(
        (list) => {
          // @todo when permission API will be available, fill form with empty permissions
        }
      );

    if (this.item) {
      this.service.getAllPermissions(this.item.id);
    } else {
      // @todo when permission API will be available, load empty permissions here
      this.permissionService.getAllPermissions();
    }
  }

  private pushListToForm(group, formList) {

    var formGroup = this.defaultForm.get(group) as FormGroup;

    Object.keys(formList).forEach(key => {
      formGroup.addControl(formList[key]['id'], new FormControl());
      formGroup.controls[formList[key]['id']]['id'] = formList[key]['id'];
      formGroup.controls[formList[key]['id']]['name'] = formList[key]['name'];
    });

  }

  private setValueOfGroup(group, list, state) {

    let rights = {};

    Object.keys(list).forEach(key => {
      let id = list[key].id;
      state = list[key].selected;
      rights[id] = state;
    });

    this.defaultForm.controls[group].patchValue(rights);

  }

  private builForm() {

    if (this.item) {
      this.defaultForm = this.formBuilder.group({
        name: [this.item.name],
        frontendPermissions: this.formBuilder.group([]),
        apiPermissions: this.formBuilder.group([]),
      });

    } else {
      this.defaultForm = this.formBuilder.group({
        name: ['', Validators.required],
        frontendPermissions: this.formBuilder.group([]),
        apiPermissions: this.formBuilder.group([]),
      });
    }
  }

  getControls(path: string) {

    const group = this.defaultForm.get(path) as FormGroup;

    return Object.keys(group.controls);
  }

  public selectUnselectAll(permissions, state) {

    let values = this.defaultForm.controls[permissions].value;

    Object.keys(values).forEach(key => {
      values[key] = state;
    });

    this.defaultForm.controls[permissions].patchValue(values);

  }

  public onSubmit() {
    if (this.item) {
      this.update();
    } else {
      this.create();
    }
    this.bsModalRef.hide();
  }

  public clearPermissionsToSend(permissions) {

    let clearedPermissions = [];

    Object.keys(permissions.frontendPermissions).forEach(key => {
      if (permissions.frontendPermissions[key]) {
        clearedPermissions.push(parseInt(key));
      }
    });

    Object.keys(permissions.apiPermissions).forEach(key => {
      if (permissions.apiPermissions[key]) {
        clearedPermissions.push(parseInt(key));
      }
    });

    return clearedPermissions;
  }

  public update() {

    let id = this.item.id;
    let name = this.defaultForm.value.name;

    let formValues = this.clearPermissionsToSend(this.defaultForm.value);
    let dataToSend = {};

    dataToSend['id'] = id;
    dataToSend['name'] = name;
    dataToSend['permission_ids'] = formValues;

    this.service.updateItemFromList(dataToSend);
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
    let dataToSend = this.defaultForm.value;
    this.service.pushItemToList(dataToSend);
  }

}
