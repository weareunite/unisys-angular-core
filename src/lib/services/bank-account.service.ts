import {Injectable} from '@angular/core';

import {BaseService} from './base.service';
import {BankAccount} from '../models';

@Injectable({
  providedIn: 'root'
})
export class BankAccountService extends BaseService {
  protected url = 'transactionSource';

  updateBankAccountFromList(item: BankAccount) {
    this.updateItemFromList(item);
  }

  pushBankAccountToList(item: BankAccount) {
    this.pushItemToList(item);
  }
}
