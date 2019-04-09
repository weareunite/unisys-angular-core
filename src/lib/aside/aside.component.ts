import { Component, Inject, Injectable, OnInit } from '@angular/core';
import { MenuItem } from '../models';
import { CoreService } from '../services/core.service';
import { CategoryService } from '../../../../../src/app/services/category.service';
import { Subscription } from 'rxjs';

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
    private categorySubscription: Subscription;

    constructor(
        public coreService: CoreService,
        public categoryService: CategoryService,
        @Inject('menu') private asideMenu,
    ) {
    }

    ngOnInit(): void {

        this.categorySubscription = this.categoryService.listChanged
            .subscribe((categories) => {
                this.asideMenu[0]['submenuItems'] = [];
                Object.keys(categories).forEach(function (index) {
                    this.asideMenu[0]['submenuItems'].push(
                        {
                            name: categories[index]['name'],
                            routerLink: ['admin', 'products', 'category', categories[index]['id']]
                        }
                    );
                }, this);
            });

        this.categoryService.getItemList();
    }
}

