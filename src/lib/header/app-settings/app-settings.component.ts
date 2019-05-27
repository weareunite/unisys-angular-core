import { Component, OnInit } from '@angular/core';
import { MenuItem, Contact } from '../../models';
import { SettingsService } from '../../services/settings.service';
import { Subscription } from 'rxjs';
import { CoreService } from '../../services/core.service';

@Component({
  selector: 'app-app-settings',
  templateUrl: './app-settings.component.html',
  styleUrls: ['./app-settings.component.css']
})
export class AppSettingsComponent implements OnInit {
  public company: Contact;
  private settingsSubscription: Subscription;

  constructor(
    private settingsService: SettingsService,
    private coreService: CoreService
  ) {
  }

  ngOnInit() {
    this.settingsSubscription = this.settingsService.companyChanged
      .subscribe(
        (item) => {
          this.company = item;
        }
      );
    this.settingsService.getCompany();

  }

  public companyMenuList: MenuItem[] = [];

  public toolsMenuList: MenuItem[] = [];
}
