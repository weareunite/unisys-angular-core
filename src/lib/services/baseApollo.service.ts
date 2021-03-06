import {Injectable} from '@angular/core';

import {BaseService} from './base.service';
import {HttpService} from './http.service';
import {UnisysAngularAppStateServiceService} from '@weareunite/unisys-angular-app-state-service';
import {ApolloService} from './apollo.service';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export abstract class BaseApolloService extends BaseService {

  protected selectionPlural: string;
  protected selection: string;
  protected operationType: string;
  protected operationTypePlural: string;
  protected clientName: string;
  protected properties: any[];
  protected operationName: string;
  protected autoLoadData = true;
  private _conditions: any[] = null;
  public fakeItemList;
  public distinctList;
  public distinctListChanged = new Subject<any[]>();

  constructor(
    protected http: HttpService,
    protected appStateService: UnisysAngularAppStateServiceService,
    protected apollo: ApolloService
  ) {
    super(http, appStateService, apollo);
  }

// (C)RUD

  createItem(item: any, postData?: any) {

    let queryClientName = this.clientName;

    if (typeof queryClientName === 'undefined') {
      queryClientName = '';
    }

    item = this.removeIdFromItem(item);

    const apolloInstnc = this.apollo.setOperationName('mutation')
      .setOperationType('create' + this.capitalizeFirstLetter(this.operationType))
      .setPostData(postData)
      .setSelection(this.selection)
      .clearMetaData()
      .setQuery()
      .mutate(queryClientName);

    apolloInstnc.subscribe(result => {
      this.setItem(result.data);
      // this.setPaging();
    });

    return apolloInstnc;
  }

  fixBooleanAsString(item, propertiesArray) {
    Object.keys(item).forEach(function (index) {
      if (typeof this.properties !== 'undefined') {
        if (this.properties.includes(index)) {

          let value = item[index];

          if (typeof value === 'boolean') {
            switch (value) {
              case true:
                value = 'true';
                break;
              case false:
                value = 'false';
                break;
            }
          }

          propertiesArray.push({key: index, value: value});
          delete item[index];
        }
      }
    }, this);

    return {item: item, properties: propertiesArray};
  }

  pushItemToList(item: any, isNewItem?: boolean) { // TODO TOTO isNewItem treba dat prec

    // If autoLoadData is turned on (dump data provided), dont send
    // data to server and await response, just set item with form
    // data and unshift it to the item list
    if (!this.autoLoadData) {
      item.id = this.itemList.length + 1;
      this.itemList.unshift(item);
      this.setItemList(this.itemList);
      return false;
    }

    item = this.removeIdFromItem(item);   // TODO TOTO tu je asi zbytočné

    let propertiesArray = [];
    const itemAction = 'create' + this.capitalizeFirstLetter(this.operationType);

    item = this.fixBooleanAsString(item, propertiesArray).item;
    propertiesArray = this.fixBooleanAsString(item, propertiesArray).properties;

    if (propertiesArray.length > 0) {
      item['properties'] = propertiesArray;
    }

    const unvariabledSelection = this.selection.replace('%VARIABLE%', '');

    let queryClientName = this.clientName;

    if (typeof queryClientName === 'undefined') {
      queryClientName = '';
    }

    const apolloInstnc = this.apollo.setOperationName('mutation')
      .setOperationType(itemAction)
      .setPostData(item)
      .setSelection(unvariabledSelection)
      .clearMetaData()
      .setQuery()
      .mutate(queryClientName);

    apolloInstnc.subscribe(result => {
      const newItem = result['data'][itemAction];

      if (isNewItem) {
        newItem['new'] = true;
      }

      this.setItem(newItem);

      this.itemList.unshift(newItem);
      this.setItemList(this.itemList);
      // this.setPaging();
    });
  }

// C(R)UD

  getItemFromCondition(id: number) {
    this._conditions = [
      {
        field: 'id',
        values: [id.toString()]
      }
    ];

    const apolloInstnc = this.apollo.setOperationName('query')
      .setOperationType(this.operationTypePlural)
      .setParams(this.generateGraphQlParams())
      .setPostData()
      .setConditions(this._conditions)
      .setSelection(this.selectionPlural ? this.selectionPlural : this.selection, 'data')
      .setMetaData()
      .setQuery()
      .watchQuery();


    apolloInstnc.subscribe(result => {
      this.setItem(result.data[this.operationTypePlural].data[0]);
    });
  }

  getItem(id: number) {

    let queryClientName = this.clientName;

    if (typeof queryClientName === 'undefined') {
      queryClientName = '';
    }

    const apolloInstnc = this.apollo.setOperationName('query')
      .setOperationType(this.operationType)
      .setParams()
      .setPostData({id: id})
      .setSelection(this.selection)
      .setMetaData([])
      .setQuery()
      .watchQuery(queryClientName);

    apolloInstnc.subscribe(result => {
      this.setItem(result.data[this.operationType]);
    });
  }

  getItemFromServerToList(item: any) {
    let queryClientName = this.clientName;

    if (typeof queryClientName === 'undefined') {
      queryClientName = '';
    }

    const apolloInstnc = this.apollo.setOperationName('query')
      .setOperationType(this.operationType)
      .setParams()
      .setPostData({id: item.id})
      .setSelection(this.selection)
      .setMetaData([])
      .setQuery()
      .watchQuery(queryClientName);

    apolloInstnc.subscribe(result => {
      const updatedItem = result.data[this.operationType];
      this.setItem(updatedItem);
      this.itemList.forEach(function (entry, index, object) {
        if (entry.id === updatedItem.id) {
          Object.keys(updatedItem).forEach(function (key) {
            object[index][key] = updatedItem[key];
          });
        }
      });
      this.setItemList(this.itemList);
    });
  }

  validateAndTransformProperties(item) {
    if (item.hasOwnProperty('properties')) {
      const newItem = Object.assign({}, item);
      Object.keys(item.properties).forEach(function (i) {
        const property = item.properties[i];
        const key = property['key'];
        let value = property['value'];

        if (value === 'true') {
          value = true;
        } else if (value === 'false') {
          value = false;
        }

        item[key] = value;
      }, this);
    }
    return item;
  }

  getItemList() {

    let queryClientName = this.clientName;

    if (typeof queryClientName === 'undefined') {
      queryClientName = '';
    }

    if (!this.autoLoadData) {
      this.setItemList(this.fakeItemList);
      return false;
    }

    const apolloInstnc = this.apollo.setOperationName('query')
      .setOperationType(this.operationTypePlural)
      .setParams(this.generateGraphQlParams())
      .setConditions(this._conditions)
      .setSelection(this.selectionPlural ? this.selectionPlural : this.selection, 'data')
      .setMetaData()
      .setQuery()
      .watchQuery(queryClientName);


    apolloInstnc.subscribe(result => {
      Object.keys(result.data[this.operationTypePlural].data).forEach(function (i) {
        let item = result.data[this.operationTypePlural].data[i];
        item = this.validateAndTransformProperties(item);
        result.data[this.operationTypePlural].data[i] = item;
      }, this);
      this.setItemList(result.data[this.operationTypePlural].data);
      this.setPaging(this.apollo.getMetaData(result.data[this.operationTypePlural]));
    });
  }

  getDistinctList(selection: string) {

    const apolloInstnc = this.apollo.setOperationName('query')
      .setOperationType(this.operationTypePlural)
      .setParams({distinct: true})
      .setSelection(selection, 'data')
      .setMetaData([])
      .setQuery()
      .watchQuery();


    apolloInstnc.subscribe(result => {
      this.setDistinctList(result.data[this.operationTypePlural].data);
    });
  }

// CR(U)D

  updateItemFromList(item: any, postData?: any, action?: string) {

    let queryClientName = this.clientName;

    if (typeof queryClientName === 'undefined') {
      queryClientName = '';
    }

    let mutationName = '';
    if (action) {
      mutationName = action + this.firstLetterUp(this.operationType);
    } else {
      mutationName = 'update' + this.firstLetterUp(this.operationType);
    }


    let propertiesArray = [];

    item = this.fixBooleanAsString(item, propertiesArray).item;
    propertiesArray = this.fixBooleanAsString(item, propertiesArray).properties;

    if (propertiesArray.length > 0) {
      postData['properties'] = propertiesArray;
    }

    const apolloInstnc = this.apollo.setOperationName('mutation')
      .setOperationType(mutationName)
      .setPostData(postData)
      .setSelection('')
      .setQuery()
      .mutate(queryClientName);

    const thisInstance = Object.assign({}, this);

    apolloInstnc.subscribe(data => {
      this.itemList.forEach(function (entry, index, object) {
        if (entry.id === item.id) {
          Object.keys(item).forEach(function (key) {
            object[index][key] = item[key];
          });
        }
      });
      this.setItemList(this.itemList);
    });
  }

// CRU(D)

  removeItemFromList(list, item) {
    list.forEach(function (entry, index, object) {
      if (entry.id === item.id) {
        object.splice(index, 1);
      }
    });

    return list;
  }

  deleteItem(id: number) {

    let queryClientName = this.clientName;

    if (typeof queryClientName === 'undefined') {
      queryClientName = '';
    }

    let apolloInstnc = this.apollo.setOperationName('mutation')
      .setOperationType('delete' + this.firstLetterUp(this.operationType))
      .setPostData({id: id})
      .setSelection('')
      .setQuery()
      .mutate(queryClientName);

    apolloInstnc.subscribe(data => {

    });
  }

  deleteItemFromList(item: any) {

    let queryClientName = this.clientName;

    if (typeof queryClientName === 'undefined') {
      queryClientName = '';
    }
    let apolloInstnc = this.apollo.setOperationName('mutation')
      .setOperationType('delete' + this.firstLetterUp(this.operationType))
      .setPostData({id: item.id})
      .setSelection('')
      .setQuery()
      .mutate(queryClientName);

    apolloInstnc.subscribe(data => {
      this.itemList.forEach(function (entry, index, object) {
        if (entry.id === item.id) {
          object.splice(index, 1);
        }
      });
      this.setItemList(this.itemList);
    });
  }

  deleteSelected() {
    const idArray = {
      ids: []
    };
    this.itemList.forEach(function (entry, index) {
      if (entry.selected) {
        idArray['ids'].push(entry.id);
      }
    });

    const apolloInstnc = this.apollo.setOperationName('mutation')
      .setOperationType('massDelete' + this.firstLetterUp(this.operationType))
      .setPostData(idArray)
      .setSelection('')
      .setQuery()
      .mutate();

    apolloInstnc.subscribe(data => {
      for (let i = this.itemList.length - 1; i >= 0; i--) {
        if (this.itemList[i].selected) {
          this.itemList.splice(i, 1);
        }
      }
      this.setItemList(this.itemList);
    });
  }

// SETTERS

  protected setSelection(selection: string[]) {
    this.selection = this.fixColumnNamesForGraphQl(selection);
    return this;
  }

  protected setOperationType(operationType: string) {
    this.operationType = operationType;
    return this;
  }

  protected setOperationName(operationName: string) {
    this.operationName = operationName;
    return this;
  }

  setDistinctList(distinctList: any[]) {
    this.distinctList = distinctList;
    this.distinctListChanged.next(this.distinctList);
  }

// HELPERS

  protected capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  protected generateGraphQlParams(group?: string, forcedArgs?: {}) {
    const paramsObj = {};
    if (this.page) {

      if (!group) {
        paramsObj['page'] = this.page;
      }

      if (forcedArgs && forcedArgs.hasOwnProperty('page')) {
        paramsObj['page'] = forcedArgs['page'];
      }

    }
    if (this.limit) {

      if (!group) {
        paramsObj['limit'] = this.limit;
      }

      if (forcedArgs && forcedArgs.hasOwnProperty('limit')) {
        paramsObj['limit'] = forcedArgs['limit'];
      }

    }

    if (this.order) {

      if (!group) {
        paramsObj['order'] = this.order;
      }

      if (forcedArgs && forcedArgs.hasOwnProperty('order')) {
        paramsObj['order'] = forcedArgs['order'];
      }
    }
    if (Object.keys(this.search).length > 0) {
      if (!group) {
        paramsObj['search'] = this.search;
      }
    }
    if (Object.keys(this.filter).length > 0) {

      if (group) {
        paramsObj['conditions'] = this.filter[group];
      } else {

        paramsObj['conditions'] = {};

        Object.keys(this.filter).forEach(function (index) {
          if (!this.filterNames.includes(index)) {
            paramsObj['conditions'][index] = this.filter[index];
          }
        }, this);
      }
    }

    return paramsObj;
  }

  protected fixColumnNamesForGraphQl(input) {
    let array = {};
    input.forEach(function (entry) {
      const arrayFromString = entry.split('.');
      let jsonToPush = {};
      if (arrayFromString.length === 1) {
        array[arrayFromString[0]] = '';
      } else if (arrayFromString.length === 2) {
        if (!array[arrayFromString[0]]) {
          array[arrayFromString[0]] = {};
        }
        jsonToPush[arrayFromString[1]] = '';
        array[arrayFromString[0]] = jsonToPush;
      } else if (arrayFromString.length === 3) {
        if (!array[arrayFromString[0]]) {
          array[arrayFromString[0]] = {};
        }
        if (!array[arrayFromString[0]][arrayFromString[1]]) {
          array[arrayFromString[0]][arrayFromString[1]] = {};
        }
        jsonToPush[arrayFromString[2]] = '';
        array[arrayFromString[0]][arrayFromString[1]] = jsonToPush;
      } else if (arrayFromString.length === 4) {
        if (!array[arrayFromString[0]]) {
          array[arrayFromString[0]] = {};
        }
        if (!array[arrayFromString[0]][arrayFromString[1]]) {
          array[arrayFromString[0]][arrayFromString[1]] = {};
        }
        if (!array[arrayFromString[0]][arrayFromString[1]][arrayFromString[2]]) {
          array[arrayFromString[0]][arrayFromString[1]][arrayFromString[2]] = {};
        }
        jsonToPush[arrayFromString[3]] = '';
        array[arrayFromString[0]][arrayFromString[1]][arrayFromString[2]] = jsonToPush;
      }
    });
    let output = JSON.stringify(array);
    output = output.replace(/:/g, '');
    output = output.replace(/"/g, '');
    output = output.substring(1, output.length - 1);
    return output;
  }

  // Helpers

  firstLetterUp(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  removeIdFromItem(item) {
    delete item['id'];
    return item;
  }

  get conditions(): any[] {
    return this._conditions;
  }

  set conditions(value: any[]) {
    this._conditions = value;
  }
}


