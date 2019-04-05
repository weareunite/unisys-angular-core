import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Component, HostListener, TemplateRef, ViewChild } from '@angular/core';
import { ActivityLogDetailService } from '../services/activity-log-detail.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-log-everywhere',
    templateUrl: './log-everywhere.component.html',
    styleUrls: ['./log-everywhere.component.scss']
})
export class LogEverywhereComponent {

    private itemSubscription;
    private item;
    private modalOpenSubscription: Subscription;

    modalRef: BsModalRef;
    config = {
        animated: true,
        keyboard: true,
        backdrop: true,
        'class': 'modal-lg'
    };

    @ViewChild('template') private template: TemplateRef<any>;

    constructor(
        private modalService: BsModalService,
        private activityLogDetailService: ActivityLogDetailService,
    ) {
        this.itemSubscription = this.activityLogDetailService.itemChanged
            .subscribe(
                (item) => {
                    this.item = item;
                }
            );

        this.modalOpenSubscription = this.activityLogDetailService.modalOpened
            .subscribe(() => {
                this.openModal(this.template);
            });
    }

    openModal(template: TemplateRef<any>) {
        this.modalRef = this.modalService.show(template, this.config);
    }

    @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
        if (event.key === 'F3') {
            this.openModal(this.template);
        }
    }

}



