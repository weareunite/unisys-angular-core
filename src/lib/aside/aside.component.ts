import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Injectable, OnInit} from '@angular/core';
import {MenuItem} from '../models';
import {CoreService} from '../services/core.service';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-aside',
  templateUrl: './aside.component.html',
  styleUrls: ['./aside.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AsideComponent implements OnInit {
  public itemList: MenuItem[] = [];
  public haveItems: boolean = false;
  private obtainedItemList: Subscription;

  constructor(
    public coreService: CoreService,
    public router: Router,
    private cdr: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.obtainedItemList = this.coreService.itemListChanged.subscribe((data: MenuItem[]) => {
      this.itemList = data;
      this.haveItems = true;

      setTimeout(() => {
        this.cdr.detectChanges();
        this.cdr.markForCheck();
      });
    });
  }
}

