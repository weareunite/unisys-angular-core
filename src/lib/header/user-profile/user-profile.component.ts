import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Language, User } from '../../models';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { BsLocaleService, defineLocale, skLocale } from 'ngx-bootstrap';
import { CoreService } from '../../services/core.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  public user;
  private userSubscription: Subscription;
  public langList: Language[];
  private langSubscription: Subscription;

  constructor(
    private userService: UserService,
    private coreService: CoreService,
  ) {
  }

  ngOnInit() {
    this.userSubscription = this.userService.userChanged
      .subscribe(
        (item) => {
          this.user = item;
        }
      );
    this.langSubscription = this.coreService.langListChanged.subscribe((list: Language[]) => {
      this.langList = list;
    });
  }

  onLogOut() {
    this.userService.logOut();
  }

  onSetTranslation(langCode) {
    this.coreService.setTranslation(langCode);
  }

}
