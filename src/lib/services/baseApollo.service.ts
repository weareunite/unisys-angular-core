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
  protected operationName: string;
  protected autoLoadData = true;
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

    item = this.removeIdFromItem(item);

    const apolloInstnc = this.apollo.setOperationName('mutation')
      .setOperationType('create' + this.capitalizeFirstLetter(this.operationType))
      .setPostData(postData)
      .setSelection(this.selection)
      .clearMetaData()
      .setQuery()
      .mutate();

    apolloInstnc.subscribe(result => {
      this.setItem(result.data);
      // this.setPaging();
    });
  }

  pushItemToList(item: any, isNewItem?: boolean) { // TODO TOTO isNewItem treba dat prec

    item = this.removeIdFromItem(item);   // TODO TOTO tu je asi zbytočné

    const itemAction = 'create' + this.capitalizeFirstLetter(this.operationType);

    let unvariabledSelection = this.selection.replace('%VARIABLE%', '');

    const apolloInstnc = this.apollo.setOperationName('mutation')
      .setOperationType(itemAction)
      .setPostData(item)
      .setSelection(unvariabledSelection)
      .clearMetaData()
      .setQuery()
      .mutate();

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

  getItem(id: number) {
    const apolloInstnc = this.apollo.setOperationName('query')
      .setOperationType(this.operationType)
      .setParams()
      .setPostData({id: id})
      .setSelection(this.selection)
      .setMetaData([])
      .setQuery()
      .watchQuery();

    apolloInstnc.subscribe(result => {
      this.setItem(result.data[this.operationType]);
    });
  }

  getItemFromServerToList(item: any) {
    const apolloInstnc = this.apollo.setOperationName('query')
      .setOperationType(this.operationType)
      .setParams({id: item.id})
      .setSelection(this.selection)
      .setQuery()
      .watchQuery();

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

  /**
   * Set fake item as item list for dumping
   *
   * @param items Items to be dumped as item list
   */
  setFakeItemList(items: any[]) {
    setTimeout(() => this.setItemList(items), 500);
  }

  getItemList() {

    if (!this.autoLoadData) {
      return false;
    }

    const apolloInstnc = this.apollo.setOperationName('query')
      .setOperationType(this.operationTypePlural)
      .setParams(this.generateGraphQlParams())
      .setSelection(this.selectionPlural ? this.selectionPlural : this.selection, 'data')
      .setMetaData()
      .setQuery()
      .watchQuery();


    apolloInstnc.subscribe(result => {
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

    let mutationName = '';
    if (action) {
      mutationName = action + this.firstLetterUp(this.operationType);
    } else {
      mutationName = 'update' + this.firstLetterUp(this.operationType);
    }

    let apolloInstnc = this.apollo.setOperationName('mutation')
      .setOperationType(mutationName)
      .setPostData(postData)
      .setSelection('')
      .setQuery()
      .mutate();

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

  deleteItemFromList(item: any) {
    let apolloInstnc = this.apollo.setOperationName('mutation')
      .setOperationType('delete' + this.firstLetterUp(this.operationType))
      .setPostData({id: item.id})
      .setSelection('')
      .setQuery()
      .mutate();

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
}


