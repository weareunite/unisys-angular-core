import { Component, Inject, Injectable, OnInit } from '@angular/core';
import { MenuItem } from '../models';
import { Subscription } from "rxjs";
import { CoreService } from "../services/core.service";

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.css']
})
export class AsideComponent{
    public itemList: MenuItem[] = this.coreService.itemList;

    constructor(
        public coreService: CoreService,
        @Inject('menu') private asideMenu,
    ){}
}
