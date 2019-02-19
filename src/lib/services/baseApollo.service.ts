import { Injectable } from '@angular/core';

import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export abstract class BaseApolloService extends BaseService {

  protected apolloInstnc;
  protected selection: string;
  protected paramsObj: object;
  protected operationType: string;
  protected operationTypePlural: string;
  protected operationName: string;

// (C)RUD

  createItem(item: any) {

    this.apolloInstnc = this.apollo.setOperationName('mutation')
      .setOperationType('create' + this.capitalizeFirstLetter(this.operationType))
      .setPostData(item)
      .watchQuery();

    this.apolloInstnc.subscribe(result => {
      this.setItem(result.data);
      // this.setPaging();
    });
  }

  pushItemToList(item: any) {
    this.apolloInstnc = this.apollo.setOperationName('mutation')
      .setOperationType('create' + this.capitalizeFirstLetter(this.operationType))
      .setPostData(item)
      .watchQuery();

    this.apolloInstnc.subscribe(result => {
      const newItem = result['data'];
      newItem['new'] = true;
      this.setItem(newItem);

      this.itemList.unshift(newItem);
      this.setItemList(this.itemList);
      // this.setPaging();
    });
  }

// C(R)UD

  getItem(id: number) {
    this.apolloInstnc = this.apollo.setOperationName('query')
      .setOperationType(this.operationType)
      .setParams({id: id})
      .setSelection(this.selection)
      .watchQuery();

    this.apolloInstnc.valueChanges.subscribe(result => {
      this.setItem(result.data);
      // this.setPaging();
    });
  }

  getItemFromServerToList(item: any) {
    this.apolloInstnc = this.apollo.setOperationName('query')
      .setOperationType(this.operationType)
      .setParams({id: item.id})
      .setSelection(this.selection)
      .watchQuery();

    this.apolloInstnc.valueChanges.subscribe(result => {
      this.setItem(result.data);
      let updatedItem = result['data'];
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

  getItemList() {

    this.apolloInstnc = this.apollo.setOperationName('query')
      .setOperationType(this.operationTypePlural)
      .setParams(this.generateGraphQlParams())
      .setSelection(this.selection)
      .watchQuery();


    this.apolloInstnc.valueChanges.subscribe(result => {
      this.setItemList(result.data[this.operationTypePlural].data);
      // this.setPaging(data['meta']);
      // this.setItemList();
      // this.setPaging();
    });
  }

// CR(U)D

  updateItemFromList(item: any, action?: string) {

    // mutation {updateUser(id:8,name:"Gay",surname:"Zilka",username:"vlado.zilka@gmail.com",email:"vlado.zilka@gmail.com")}
    let mutationName = '';
    if (action) {
      mutationName = action + this.firstLetterUp(this.operationType);
    } else {
      mutationName = 'update' + this.firstLetterUp(this.operationType);
    }

    this.apolloInstnc = this.apollo.setOperationName('mutation')
      .setOperationType(mutationName)
      .setPostData(item)
      .setSelection('')
      .watchQuery();

    this.apolloInstnc.subscribe(data => {
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
    this.apolloInstnc = this.apollo.setOperationName('mutation')
      .setOperationType('delete' + this.firstLetterUp(this.operationType))
      .setParams({id: item.id})
      .setSelection('')
      .watchQuery();

    this.apolloInstnc.subscribe(data => {
      this.itemList.forEach(function (entry, index, object) {
        if (entry.id === item.id) {
          object.splice(index, 1);
        }
      });
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

// HELPERS

  protected capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  protected generateGraphQlParams() {
    this.paramsObj = {};
    if (this.page) {
      this.paramsObj['page'] = this.page;
    }
    if (this.limit) {
      this.paramsObj['limit'] = this.limit;
    }
    if (this.order) {
      this.paramsObj['order'] = this.order;
    }
    if (Object.keys(this.search).length > 0) {
      this.paramsObj['search'] = this.search;
    }
    if (Object.keys(this.filter).length > 0) {
      this.paramsObj['conditions'] = this.filter;
    }
    return this.paramsObj;
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
}


