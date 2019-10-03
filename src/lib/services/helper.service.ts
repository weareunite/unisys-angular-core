import {Injectable} from '@angular/core';

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
    return array.filter(item => item[key] === value);
  }

  getPropertyValue(item, key) {

    let property: string | boolean = null;

    if (typeof item !== 'undefined') {
      if (item.hasOwnProperty('properties')) {
        const properties = item.properties;

        Object.keys(properties).forEach(function (i) {
          if (properties[i]['key'] === key) {
            property = properties[i]['value'];
          }
        });
      }

      if (property === 'true') {
        property = true;
      }

      if (property === 'false') {
        property = false;
      }
    } else {
      property = null;
    }

    return property;
  }

  public fixVariableTypes(array: any[], keys: string[], type) {

    Object.keys(keys).forEach(function (i) {
      const key = keys[i];

      if (array.hasOwnProperty(key)) {

        const value = array[key];

        switch (type) {
          case 'float':
            if (value !== '') {
              array[key] = parseFloat(value);
            } else {
              delete array[key];
            }
            break;
          case 'number':
            if (value !== '') {
              array[key] = parseInt(value);
            } else {
              delete array[key];
            }
            break;
          case 'string':
            array[key] = value.toString();
        }
      }
    });

    return array;

  }
}
