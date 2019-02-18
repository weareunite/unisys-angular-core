import {Injectable} from '@angular/core';

import {BaseService} from './base.service';

@Injectable({
  providedIn: 'root'
})
export abstract class BaseApolloService extends BaseService{

    protected selection: string;
    protected paramsObj: object;
    protected operationType: string;
    protected operationTypePlural: string;
    protected operationName: string;

// (C)RUD

    createItem(item: any) {
        this.http.post(this.url, item).subscribe(data => {
            this.setItem(data['data']);
        });
        this.apollo .setOperationName('mutation')
                    .setOperationType('update'+this.capitalizeFirstLetter(this.operationType))
                    .setPostData(item)
                    .watchQuery().valueChanges.subscribe(result => {
                        this.setItem(result.data);
                        // this.setPaging();
                    });
    }


// C(R)UD

    getItem(id: number) {
        this.apollo .setOperationName(this.operationName)
                    .setOperationType(this.operationType)
                    .setParams({id: id})
                    .setSelection(this.selection)
                    .watchQuery().valueChanges.subscribe(result => {
                        this.setItem(result.data);
                        // this.setPaging();
                    });
    }

    getItemList() {
        this.apollo .setOperationName(this.operationName)
                    .setOperationType(this.operationTypePlural)
                    .setParams(this.generateGraphQlParams())
                    .setSelection(this.selection)
                    .watchQuery().valueChanges.subscribe(result => {
                        this.setItemList(result.data);
                        // this.setPaging();
                    });
        }

// CR(U)D

// CRU(D)

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
            } else if(arrayFromString.length === 2){
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
}


