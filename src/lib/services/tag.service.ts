import {Injectable} from '@angular/core';

import {BaseService} from './base.service';
import {Tag} from '../models';

@Injectable({
  providedIn: 'root'
})
export class TagService extends BaseService{
    protected url = 'tag';
}
