import {Injectable} from '@angular/core';

import {BaseService} from './base.service';

@Injectable({
  providedIn: 'root'
})
export class CountryService extends BaseService{
    protected url = 'country';

    getItemList() {
        let url = this.url+'/listForSelect';
        this.http.get(url).subscribe(data => {
            this.setItemList(data['data']);
        });
    }
}
