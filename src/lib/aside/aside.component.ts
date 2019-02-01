import { Component, OnInit } from '@angular/core';
import { MenuItem } from '../models';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.css']
})
export class AsideComponent implements OnInit {
  public mainMenuList: MenuItem[] = [];

  constructor() {
  }

  ngOnInit() {
  }

}
