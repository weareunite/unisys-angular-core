import {Component, OnInit} from '@angular/core';
import {MenuItem} from '../models';

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.css']
})
export class AsideComponent implements OnInit {
  public mainMenuList: MenuItem[] = [
    {routerLink: ['default'], permission: 'default', translation: 'STATS', icon: 'fa fa-tasks'},
    {routerLink: ['expense'], permission: 'expense', translation: 'EXPENSES', icon: 'fa fa-file-text-o'},
    {routerLink: ['transaction'], permission: 'transaction', translation: 'TRANSACTIONS', icon: 'fa fa-bars'},
    {routerLink: ['draw'], permission: 'draw', translation: 'DRAWS', icon: 'fa fa-bank'},
    {routerLink: ['cofinance'], permission: 'cofinance', translation: 'COFINANCE', icon: 'fa fa-life-ring'},
    {routerLink: ['contact'], permission: 'contact', translation: 'PARTNERS', icon: 'fa fa-suitcase'},
    {routerLink: ['grant'], permission: 'grant', translation: 'GRANTS', icon: 'fa fa-sign-in'},
    {routerLink: ['project'], permission: 'project', translation: 'PROJECTS', icon: 'fa fa-cubes'}
  ];

  constructor() {
  }

  ngOnInit() {
  }

}
