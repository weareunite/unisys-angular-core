import { Component, HostListener, TemplateRef, ViewChild } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { HttpClient } from '@angular/common/http';

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

    @ViewChild('template') private template: TemplateRef<any>;

    constructor(
        private modalService: BsModalService,
        private http: HttpClient
    ){
    }

    openModal(template: TemplateRef<any>){
        this.modalRef = this.modalService.show(template, this.config);
    }

    @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent){
        if (event.keyCode === 112){
            this.openModal(this.template);
        }
    }

    onClickTopic(topic: string){
        this.selectedTopic = topic;
        // this.http.get('/assets/docs/' + this.selectedTopic + '.md', {responseType: 'text'})
        //     .subscribe(data => {
        //         this.content = data;
        //     }, error2 => {
        //         this.content = '';
        //         this.selectedTopic = '';
        //     });

    }

}
