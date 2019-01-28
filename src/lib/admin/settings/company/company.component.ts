import { Component, OnInit } from '@angular/core';
import {Subscription} from 'rxjs';
import {SettingsService} from '../../../services/settings.service';
import {Contact} from '../../../models';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {CountryService} from '../../../services/country.service';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit {

  settingsSubscription : Subscription;
  countrySubscription : Subscription;
  countryList : any[];
  item: Contact;

  constructor(
      protected settingsService: SettingsService,
      protected countryService: CountryService,
      public formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
      this.settingsSubscription = this.settingsService.companyChanged
          .subscribe(
              (item) => {
                  this.item = item;
                  this.builForm();
              }
          );
      this.countrySubscription = this.countryService.listChanged
          .subscribe(
              (list) => {
                  this.countryList = list;
              }
          );
      this.settingsService.getCompany();
      this.countryService.getItemList();

  }

    defaultForm = new FormGroup ({
        company: new FormControl(),
        country: new FormControl(),
        street: new FormControl(),
        city: new FormControl(),
        zip: new FormControl(),
        reg_no: new FormControl(),
        tax_no: new FormControl(),
        vat_no: new FormControl(),
        web: new FormControl(),
        email: new FormControl(),
        telephone: new FormControl(),
        description: new FormControl(),
    });

    private builForm(){
        this.defaultForm = this.formBuilder.group({
            company: [this.item.company, Validators.required],
            country: [this.item.country],
            street: [this.item.street],
            city: [this.item.city],
            zip: [this.item.zip],
            reg_no: [this.item.reg_no],
            tax_no: [this.item.tax_no],
            vat_no: [this.item.vat_no],
            web: [this.item.web],
            email: [this.item.email,],
            telephone: [this.item.telephone],
            description: [this.item.description],
        });
    }

    public onSubmit(){
        this.settingsService.updateCompany(this.defaultForm.value);
    }

}
