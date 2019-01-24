import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MenuItem} from '../models';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.css']
})
export class DefaultComponent implements OnInit {
    public context;
    public item;

    constructor(
    ) {
        this.context = this;
    }

    ngOnInit() {
    }

    public mainMenu: MenuItem[] = [
        {routerLink:['/default'],translation:'STATS',icon:''},
    ];
}
