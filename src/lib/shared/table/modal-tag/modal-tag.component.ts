
import {debounceTime} from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import {Tag} from '../../../models';
import {Subject, Subscription} from 'rxjs';
import {TagService} from '../../../services/tag.service';
import {BsModalRef} from 'ngx-bootstrap';
import {FormControl, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-modal-tag',
  templateUrl: './modal-tag.component.html',
  styleUrls: ['./modal-tag.component.css']
})

export class ModalTagComponent implements OnInit {
    private service;
    public  tagList: Tag[];
    public  tagSubscription: Subscription;
    public  tagTypehead = new Subject<string>();
    public  tagTypeheadSubscription: Subscription;

    constructor(
      public bsModalRef: BsModalRef,
      public tagService: TagService,
    ) { }

    ngOnInit() {
        this.tagSubscription = this.tagService.listChanged
            .subscribe(
                (list) => {
                    this.tagList = list;
                }
            );
        this.tagTypeheadSubscription = this.tagTypehead.pipe(debounceTime(500))
            .subscribe(
                (term) =>{
                    this.tagService.setSearch('%'+term,'name').setFilter().setOrder('name');;
                    this.tagService.getItemList();
                }
            )
        this.tagService.setFilter().setOrder('name').getItemList();
    }

    defaultForm = new FormGroup ({
        'tag': new FormControl(),
    });

    public onSubmit(){
       this.service.massAttachTagsToSelected(this.defaultForm.value.tag)
    }

}
