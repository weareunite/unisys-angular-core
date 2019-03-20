import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {BsModalRef} from 'ngx-bootstrap';
import { Help } from '../../../models';
import {Subscription} from 'rxjs';
import { AngularEditorConfig } from '@kolkov/angular-editor';

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

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '25rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    uploadUrl: 'v1/images', // if needed
    customClasses: [ // optional
      {
        name: "quote",
        class: "quote",
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ]
  };


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
        key: [this.item.key, Validators.required],
        body: [this.item.body],
      });

    } else {
      this.defaultForm = this.formBuilder.group({
        name: ['', Validators.required],
        key: ['', Validators.required],
        body: [''],
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
