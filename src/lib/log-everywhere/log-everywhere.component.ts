import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Component, HostListener, TemplateRef, ViewChild } from '@angular/core';
import { ActivityLogDetailService } from '../services/activity-log-detail.service';

@Component({
  selector: 'app-log-everywhere',
  templateUrl: './log-everywhere.component.html',
  styleUrls: ['./log-everywhere.component.scss']
})
export class LogEverywhereComponent{
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
  }

  openModal(template: TemplateRef<any>){
    this.modalRef = this.modalService.show(template, this.config);
  }

  @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if (event.key === 'F3') {
      this.openModal(this.template);
    }
  }

}



