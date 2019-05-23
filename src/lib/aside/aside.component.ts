import { Component, Inject, Injectable, OnInit } from '@angular/core';
import { MenuItem } from '../models';
import { CoreService } from '../services/core.service';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})

@Component({
    selector: 'app-aside',
    templateUrl: './aside.component.html',
    styleUrls: ['./aside.component.css']
})

export class AsideComponent implements OnInit {
    public itemList: MenuItem[] = this.coreService.itemList;

    constructor(
        public coreService: CoreService,
        public router: Router,
        @Inject('menu') private asideMenu,
    ) {
    }

    ngOnInit(): void {


    }
}

