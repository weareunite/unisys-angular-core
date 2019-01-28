import {Injectable} from '@angular/core';

import {BaseService} from './base.service';
import {Tag} from '../models';

@Injectable()
export class TagService extends BaseService{
    protected url = 'tag';
}
