import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import {User} from '../../models';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  public user;
  private userSubscription: Subscription

  constructor(
    private userService: UserService
  ) {
  }

  ngOnInit() {
    this.userSubscription = this.userService.userChanged
      .subscribe(
        (item) => {
          this.user = item;
        }
      );
  }

  onLogOut() {
    this.userService.logOut();
  }

}
