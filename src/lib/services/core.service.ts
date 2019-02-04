import { Inject, Injectable } from '@angular/core';
import { Subject} from 'rxjs';
import { MenuItem} from '../models';

@Injectable({
  providedIn: 'root'
})

export class CoreService{

  public itemList: MenuItem[];
  public itemListChanged = new Subject();

  constructor(@Inject('menu') private asideMenu){
    this.itemList = asideMenu;
  }

  setAsideMenuList(itemList:MenuItem[]){
    this.itemList = itemList;
    this.itemListChanged.next(this.itemList);
  }
}
