import { Component, HostListener, TemplateRef, ViewChild } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { HelpService } from '../services/help.service';
import { Help } from '../models';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
    selector: 'app-help',
    templateUrl: './help.component.html',
    styleUrls: ['./help.component.css']
})
export class HelpComponent{
    modalRef: BsModalRef;
    public selectedTopic = '';
    config = {
        animated: true,
        keyboard: true,
        backdrop: true,
        'class': 'modal-lg'
    };
    public content: string;
    public itemListSubscription: Subscription;
    public item: Help;
    public itemList: Help[];
    public itemSubscription: Subscription;

    @ViewChild('template') private template: TemplateRef<any>;

    constructor(
        private modalService: BsModalService,
        private helpService: HelpService,
        private router: Router,
    ) {
        this.itemListSubscription = this.helpService.listChanged
            .subscribe(
                (list: Help[]) => {
                    this.itemList = list;
                }
            )

        this.itemSubscription = this.helpService.itemChanged
            .subscribe(
                (item: Help) => {
                    this.item = item;
                }
            );
    }

    openModal(template: TemplateRef<any>){
        this.modalRef = this.modalService.show(template, this.config);
    }

    @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
        if (event.key === 'F2') {
            console.log(this.template);
            this.openModal(this.template);
            this.helpService.getItemList();
            if (this.router.url) {
                this.onClickTopic(this.router.url.replace(/[0-9]/g,  '*'));
            }
        }
    }

    onClickTopic(topic: string){
        this.selectedTopic = topic;
        this.helpService.getItemByKey(topic);
    }

}
