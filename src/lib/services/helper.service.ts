import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

/**
 * Helper class - including often used functions as helpers
 */
export class HelperService {

  constructor() {
  }

  /**
   * Find item in array by specific key, returns found item
   *
   * @param array Array to be searched
   * @param key Key to be searched
   * @param value Value to be searched
   */
  findItemInArrayByKey(array: any[], key: string, value: number | string) {
    return array.filter(item => item[key] == value);
  }
}
