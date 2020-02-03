import {Component, OnInit} from '@angular/core';
import {SettingsService} from '../../../services/settings.service';
import {Subscription} from 'rxjs';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-app',
  templateUrl: './global.component.html',
  styleUrls: ['./global.component.css']
})
export class GlobalComponent implements OnInit {

  public settingUpdated: Subscription;
  public settingAdded: Subscription;
  public addingNewSettings;

  newSettingForm = new FormGroup({
    key: new FormControl(),
    value: new FormControl(),
  });

  constructor(
    public settings: SettingsService,
    public formBuilder: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.settingUpdated = this.settings.settingsSaved.subscribe((data) => {
      this.settings.getAll();
    });

    this.settingAdded = this.settings.settingsCreated.subscribe((data) => {
      this.settings.getAll();
    });

    this.addingNewSettings = false;

    this.newSettingForm = this.formBuilder.group({
      key: ['', Validators.required],
      value: ['', Validators.required],
    });
  }

  public saveSettings(setting) {
    this.settings.updateSetting(setting);
    setting.editing = false;
  }

  public onSettingValueChange(setting, event) {
    setting.value = event.target.value;
  }

  public onNewSettingsFormSubmitted() {
    const values = this.newSettingForm.value;

    this.settings.createSetting(values);
    this.newSettingForm.reset();
    this.addingNewSettings = false;
  }
}
