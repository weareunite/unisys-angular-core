import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { HttpService } from './http.service';
import { Tag } from '../models';
import { UnisysAngularAppStateServiceService } from '@weareunite/unisys-angular-app-state-service';
import { ApolloService } from './apollo.service';

@Injectable({
    providedIn: 'root'
})

export abstract class BaseService{

    itemChanged = new Subject<any>();
    listChanged = new Subject<any[]>();
    uploadListChanged = new Subject<any[]>();

    protected item;
    protected itemList;
    protected uploadList;
    protected url: string;
    protected page: number = 1;
    protected limit: number = 100;
    protected order: string = 'id';
    protected search: any = {};
    protected filter: any = {};
    public isFilterSetted: boolean = false;
    protected pageList = [];
    public meta;


    constructor(
        protected http: HttpService,
        protected appStateService: UnisysAngularAppStateServiceService,
        protected apollo: ApolloService,
    ){
    }

//(C)RUD

    createItem(item: any){
        this.http.post(this.url, item).subscribe(data => {
            this.setItem(data['data']);
        });
    }

    pushItemToList(item: any){
        this.http.post(this.url, item).subscribe(data => {
            let newItem = data['data'];
            newItem['new'] = true;
            this.setItem(newItem);

            this.itemList.unshift(newItem);
            this.setItemList(this.itemList);
        });
    }

//C(R)UD

    getItem(id: number){
        const requestUlr = this.url + '/' + id;
        this.http.get(requestUlr).subscribe(data => {
            this.setItem(data['data']);
        });
    }

    getItemFromServerToList(item: any){
        const requestUlr = this.url + '/' + item.id;
        this.http.get(requestUlr).subscribe(data => {
            let upadtedItem = data['data'];
            this.itemList.forEach(function(entry, index, object){
                if (entry.id === upadtedItem.id){
                    Object.keys(upadtedItem).forEach(function(key){
                        object[index][key] = upadtedItem[key];
                    });
                }
            });
            this.setItemList(this.itemList);
        });
    }

    getItemList(){
        let requestUrl = this.url + this.generateUrlQuery();
        this.http.get(requestUrl).subscribe(data => {
            this.setItemList(data['data']);
            this.setPaging(data['meta']);
        });
    }

//CR(U)D

    updateItem(id: number, item){
        const requestUlr = this.url + '/' + id;
        this.http.put(requestUlr, item).subscribe(data => {
            this.itemChanged.next(item);
        });
    }

    updateItemFromList(item: any){
        const requestUlr = this.url + '/' + item.id;
        this.http.put(requestUlr, item).subscribe(data => {
            this.itemList.forEach(function(entry, index, object){
                if (entry.id === item.id){
                    Object.keys(item).forEach(function(key){
                        object[index][key] = item[key];
                    });
                }
            });
            this.setItemList(this.itemList);
        });
    }

//CRU(D)

    deleteItemFromList(item: any){
        const requestUlr = this.url + '/' + item.id;
        this.http.delete(requestUlr).subscribe(data => {
            this.itemList.forEach(function(entry, index, object){
                if (entry.id === item.id){
                    object.splice(index, 1);
                }
            });
            this.setItemList(this.itemList);
        });
    }

    addNewRowWithInputs(columns: { header: string, key: string }[]){

        var newItem = [];

        let alreadyExists = false;

        Object.keys(this.itemList).forEach(function(itemKey){
            if (this.itemList[itemKey].hasOwnProperty('new')){
                alreadyExists = true;
            }
        }, this);

        if (!alreadyExists){
            Object.keys(columns).forEach(function(columnKey){
                newItem[columns[columnKey]['key']] = {
                    value: ''
                };
            });

            newItem['new'] = 'yes';

            this.itemList.unshift(newItem);
            this.setItemList(this.itemList);
        }

    }

// FILTERS

    setFiltersByViewState(){
        if (this.appStateService.getViewState('app-filter')){
            this.setFilterByForm(this.appStateService.getViewState('app-filter'));
        }
        return this;
    }

    setPage(page?: number){
        this.page = page;
        this.appStateService.setViewStateValue(page, 'app-table.activePage');
        return this;
    }

    setPaging(reguestMetadata){
        let pagesTotal = Math.ceil(reguestMetadata.total / reguestMetadata.per_page);
        this.pageList = Array.from(new Array(pagesTotal), (val, index) => index + 1);
        this.meta = reguestMetadata;
        return this;
    }

    setLimit(limit?: number){
        this.limit = limit;
        return this;
    }

    setOrder(order?: string){
        this.order = order;
        return this;
    }

    setSearch(query?: string, fields?: string){
        if (!query && !fields){
            this.search = {};
        }else{
            this.search = {
                query: query,
                fields: fields.split(',')
            };
        }
        return this;
    }

    setFilter(key?: string, value?: any){
        if (!key && !value){
            this.filter = {};
            return this;
        }
        if (value == '' || value === null){
            delete this.filter[key];
        }else{
            this.filter[key] = value;
        }
        return this;
    }

    setFilterByForm(formObject){
        this.setFilter();
        this.setSearch();

        if (formObject){
            this.isFilterSetted = true;
        }else{
            this.isFilterSetted = false;
        }

        Object.keys(formObject).forEach(key => {
            let value = formObject[key];
            if (value && key.indexOf('fulltext') > -1){
                let array = key.split('/');
                this.setSearch('%' + value, array[1]);
            }else if (value){
                if (typeof value === 'string' || typeof value === 'number'){
                    this.setFilter(key, value);
                }else if (value instanceof Date){
                    this.setFilter(key, this.returnDatestring(value));
                }else if (value.hasOwnProperty('id')){
                    this.setFilter(key, [value.id]);
                }else if (value.length > 0 && value[0].id){
                    this.setFilter(key, this.returnIdArray(value));
                }else if (value.length > 0 && value[0].value){
                    this.setFilter(key, this.returnValueArray(value));
                }else if (value.data && value.data.length > 0){
                    this.setFilter(key, {
                        data: this.returnIdArray(value.data),
                        operator: value.operator ? value.operator : 'or'
                    });
                }else if (value.length > 0 && value[0] instanceof Date){
                    this.setFilter(key, this.returnDatestringArray(value));
                }else{
                    console.log(key + ' is not set:' + JSON.stringify(value));
                }
            }
        });
        return this;
    }

    generateUrlQuery(justForStats?){
        let stringToAppent = [];
        if (!justForStats){
            if (this.page){
                stringToAppent.push('page=' + this.page);
            }
            if (this.limit){
                stringToAppent.push('limit=' + this.limit);
            }
            if (this.order){
                stringToAppent.push('order=' + this.order);
            }
        }
        if (Object.keys(this.search).length > 0){
            console.log(JSON.stringify(this.search));
            stringToAppent.push('search=' + encodeURIComponent(JSON.stringify(this.search)));
        }
        if (Object.keys(this.filter).length > 0){
            console.log(JSON.stringify(this.filter));
            stringToAppent.push('filter=' + encodeURIComponent(JSON.stringify(this.filter)));
        }
        if (stringToAppent.length > 0){
            return '?' + stringToAppent.join('&');
        }else{
            return '';
        }
    }

// SETTERS

    setItem(item: any){
        this.item = item;
        this.itemChanged.next(this.item);
    }

    setItemList(itemList){
        this.itemList = itemList;
        this.listChanged.next(this.itemList);
    }

    setUploadList(uploadList: any[]){
        this.uploadList = uploadList;
        this.uploadListChanged.next(this.uploadList);
    }

// EXPORT

    getExport(columns: { header: string, key: string }[]){
        const requestUlr = this.url + '/export' + this.generateUrlQuery() + '&columns=' + encodeURIComponent(JSON.stringify(columns));
        let dateString = new Date().toISOString().slice(0, 19).replace('T', ' ');
        this.http.download(requestUlr, 'application/vnd.ms-excel', 'export-' + dateString + '.xls');
    }


// UPLOADS

// (C)RUD - UPLOADS

    pushUploadToList(item: any, id: number){
        const requestUlr = this.url + '/' + id + '/addFile';
        const formData = new FormData();
        formData.append('file', item);
        this.http.upload(requestUlr, formData).subscribe(data => {
            this.uploadList.push(data['data']);
            this.setUploadList(this.uploadList);
        });
    }

// C(R)UD - UPLOADS

    getItemUploads(id: number){
        const requestUlr = this.url + '/' + id + '/files';
        this.http.get(requestUlr).subscribe(data => {
            this.setUploadList(data['data']);
        });
    }

// CR(U)D - UPLOADS

    updateUploadFromList(item: any){
        const requestUlr = 'media/' + item.id;
        this.http.put(requestUlr, item).subscribe(data => {
            this.uploadList.forEach(function(entry, index, object){
                if (entry.id === item.id){
                    object[index] = item;
                }
            });
            this.setUploadList(this.uploadList);
        });
    }

// CRU(D) - UPLOADS

    deleteUploadFromList(item: any){
        const requestUlr = 'media/' + item.id;
        this.http.delete(requestUlr).subscribe(data => {
            this.uploadList.forEach(function(entry, index, object){
                if (entry.id === item.id){
                    object.splice(index, 1);
                }
            });
            this.setUploadList(this.uploadList);
        });
    }

// DOWNLOAD - UPLOADS

    download(requestUrl: string, type: string, filename: string){
        this.http.download(requestUrl, type, filename);
    }

// SELECT

    deleteSelected(){
        const idArray = {
            ids: []
        };
        this.itemList.forEach(function(entry, index){
            if (entry.selected){
                idArray['ids'].push(entry.id);
            }
        });
        return this.http.put(this.url + '/massDelete', idArray).subscribe(data => {
            for (var i = this.itemList.length - 1; i >= 0; i--){
                if (this.itemList[i].selected){
                    this.itemList.splice(i, 1);
                }
            }
            this.setItemList(this.itemList);
        });
    }

    selectAll(){
        this.itemList.forEach(function(entry, index){
            entry.selected = true;
        });
        this.setItemList(this.itemList);
    }

    unselectAll(){
        this.itemList.forEach(function(entry, index){
            entry.selected = false;
        });
        this.setItemList(this.itemList);
    }

    toggleSelect(item: any){
        this.itemList.forEach(function(entry, index){
            if (item.id === entry.id){
                if (entry.selected == null){
                    entry.selected = true;
                }else{
                    entry.selected = !entry.selected;
                }
            }
        });
        this.setItemList(this.itemList);
    }

    checkSelectedCount(){
        if (this.itemList != null){
            let count = 0;
            this.itemList.forEach(function(entry, index){
                if (entry.selected === true){
                    count++;
                }
            });
            return count;
        }else{
            return 0;
        }
    }

// TAGS

    public massAttachTagsToSelected(tagList: Tag[]){
        const requestUrl = this.url + '/massAttachTags';
        let dataToSend = {
            ids: [],
            tag_names: [],
            type: '',
        };

        tagList.forEach(function(tag, index){
            if (tag.name){
                dataToSend.tag_names.push(tag.name);
            }
        });

        function removeDuplicates(originalArray, objKey){
            var trimmedArray = [];
            var values = [];
            var value;

            for (var i = 0; i < originalArray.length; i++){
                value = originalArray[i][objKey];

                if (values.indexOf(value) === -1){
                    trimmedArray.push(originalArray[i]);
                    values.push(value);
                }
            }
            return trimmedArray;
        }

        this.itemList.forEach(function(item, index){
            if (item.selected){
                item.tags = removeDuplicates(item.tags.concat(tagList), 'name');
                dataToSend.ids.push(item.id);
            }
        });

        this.http.put(requestUrl, dataToSend).subscribe(data => {
            this.setItemList(this.itemList);
        });
    }

    public detachTag(item, tag: Tag){
        const requestUrl = this.url + '/' + item.id + '/detachTags';
        let tagArray = [];

        tagArray.push(tag.name);

        this.http.put(requestUrl, {tag_names: tagArray}).subscribe(data => {
            item.tags.forEach(function(entry, index, object){
                if (entry.name == tag.name){
                    object.splice(index, 1);
                }
            });
            this.setItemList(this.itemList);
        });
    }


// HELPERS

    public returnIdArray(list: any[]){
        let arrayToReturn = [];
        list.forEach(function(value){
            arrayToReturn.push(value.id);
        });
        return arrayToReturn;
    }

    public returnValueArray(list: any[]){
        let arrayToReturn = [];
        list.forEach(function(value){
            arrayToReturn.push(value.value);
        });
        return arrayToReturn;
    }

    public returnDatestringArray(list: Date[]){
        let arrayToReturn = [];
        list.forEach(function(value){
            arrayToReturn.push(value.toISOString().substring(0, 10));
        });
        return arrayToReturn;
    }

    public returnDatestring(value: Date){
        return value.toISOString().substring(0, 10);
    }

    public fixDates(item, list: any[]){
        list.forEach(function(value){
            if (typeof item[value] == 'object' && item[value] != null){
                item[value] = item[value].toISOString().substring(0, 10);
            }else if (typeof item[value] == 'string' && item[value] != ''){
                item[value] = new Date(item[value]).toISOString().substring(0, 10);
            }else{
                item[value] = '';
            }
            ;
        });
        return item;
    }

    public fixDateTimes(item, list: any[]){
        list.forEach(function(value){
            if (typeof item[value] == 'object' && item[value] != null){
                item[value] = item[value].toJSON().slice(0, 19).replace('T', ' ');
            }else if (typeof item[value] == 'string' && item[value] != ''){
                item[value] = new Date(item[value]).toJSON().slice(0, 19).replace('T', ' ');
            }else{
                item[value] = '';
            }
            ;
        });
        return item;
    }

    public createReferenceId(item, list: any[]){
        list.forEach(function(value){
            item[value + '_id'] = item[value].id;
        });
        return item;
    }

    public createReferenceIdArray(item, key) {
        const idArray = [];
        if (item[key] && item[key].length > 0) {
            item[key].forEach(function(value) {
                idArray.push(value.id);
            });
        }
        delete item[key];
        item[key + '_ids'] = idArray;
        return item;
    }

    public sum(array, prop){
        var total = 0;
        for (var i = 0, _len = array.length; i < _len; i++){
            total += parseFloat(array[i][prop]);
        }
        return total;

    }

}
