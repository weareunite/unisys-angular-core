import {Injectable, OnInit} from '@angular/core';
import {Subject} from 'rxjs';

import {HttpService} from './http.service';
import {Contact} from '../models';
import {ApolloService} from './apollo.service';

@Injectable({
  providedIn: 'root'
})

export class SettingsService {

  protected apolloInstnc;
  itemChanged = new Subject<any>();
  listChanged = new Subject<any[]>();
  companyChanged = new Subject<any>();
  settingsChanged = new Subject<any>();
  settingsSaved = new Subject();
  settingsCreated = new Subject();
  protected item;
  protected itemList;
  public company: Contact;
  public settings: any;

  // Apollo
  protected selectionCompany = 'id,name,is_active,contact_profile{id,name,surname,company,street,zip,city,country{id,name},reg_no,tax_no,vat_no,web,email,telephone,description}';
  protected selectionSettings = 'key,value';

  constructor(
    protected http: HttpService,
    protected apollo: ApolloService,
  ) {
  }

//C(R)UD

  getAll() {
    // let reguestUrl = this.url+'/all'
    // this.http.get(reguestUrl).subscribe(data => {
    //     let dataToSet = {
    //         'allowed_number_of_projects':1,
    //     };
    //     this.setSettings(dataToSet);
    // });

    const operationType = 'systemSettings';

    let apolloInstnc = this.apollo.setOperationName('query')
      .setOperationType(operationType)
      .setSelection(this.selectionSettings, 'data')
      .setPostData()
      .setParams()
      .setQuery()
      .watchQuery();

    apolloInstnc.subscribe(result => {
      const data = result['data'][operationType];
      this.setSettings(data);
    });

  }


  getCompany() {

    const operationType = 'company';

    let apolloInstnc = this.apollo.setOperationName('query')
      .setOperationType(operationType)
      .setSelection(this.selectionCompany)
      .setPostData()
      .setMetaData([]) // TODO SET EMPTY VALUE SHOULD MAKE IT NULL
      .setParams()
      .setQuery()
      .watchQuery();

    apolloInstnc.subscribe(result => {
      const data = result['data'][operationType];
      this.setCompany(data);
    });
  }

//CR(U)D

  updateSetting(settings) {

    const data = Object.assign(settings);

    delete data.editing;
    delete data.__typename;

    let apolloInstnc = this.apollo.setOperationName('mutation')
      .setOperationType('updateSetting')
      .setSelection('')
      .setPostData(data)
      .setQuery()
      .mutate();

    let subscription = apolloInstnc.subscribe(result => {
      this.settingsSaved.next();
    });
  }

  createSetting(setting) {

    let apolloInstnc = this.apollo.setOperationName('mutation')
      .setOperationType('createSetting')
      .setSelection('key,value')
      .setPostData(setting)
      .setQuery()
      .mutate();

    let subscription = apolloInstnc.subscribe(result => {
      this.settingsCreated.next();
    });
  }

  updateCompany(item: Contact) {

    let itemToSave = Object.assign({}, item);

    if (item.country !== null) {
      // @ts-ignore
      itemToSave['country_id'] = item.country.id.toString();
    } else {
      itemToSave['country_id'] = null;
    }
    delete itemToSave['country'];

    let apolloInstnc = this.apollo.setOperationName('mutation')
      .setOperationType('updateCompany')
      .setSelection('')
      .setPostData(itemToSave)
      .setQuery()
      .mutate();

    let subscription = apolloInstnc.subscribe(result => {
      this.setCompany(item);
      subscription.unsubscribe();
    });
    // const requestUlr = this.url + '/company';
    // this.http.put(requestUlr, item).subscribe(data => {
    //     this.setCompany(item);
    // });
    //
    // let apolloInstnc =  this.apollo.setOperationName('mutation')
    //     .setOperationType('companyProfile')
    //     .setSelection(this.selectionCompany)
    //     .watchQuery();
    //
    // apolloInstnc.subscribe(result => {
    //     console.log(result);
    //     this.setCompany(result['data']);
    // });
  }

// SETTERS

  setSettings(settings) {
    this.settings = settings;
    this.settingsChanged.next(this.settings);
  }

  setCompany(item: Contact) {
    this.company = item;
    this.companyChanged.next(this.company);
  }

}
