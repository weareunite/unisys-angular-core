import {EventEmitter, Injectable, Output} from '@angular/core';
import {WatchedChange} from '../models';
import * as moment from 'moment';
import {HttpClient} from '@angular/common/http';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {ChangeType} from '../types/change-type.enum';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChangesWatcherService {

  // Variables
  private localStoragePrefix = 'changesWatcher';
  private sendEndpoint;
  protected selector: string;
  protected order = 'asc';
  public watchedChanges: WatchedChange[] = [];

  // Subjects
  public watchingStarted = new Subject();
  public itemAdded = new Subject();
  public listSent = new Subject();
  public listCleared = new Subject();

  constructor(
    protected http: HttpClient,
    protected toastr: ToastrService,
    protected translate: TranslateService
  ) {
  }

  /**
   * Start watching changes
   */
  public startWatching() {

    const localStorageExists = this.localStorageExists();

    if (!localStorageExists) {
      this.createGlobalLocalStorage();
    } else {
      if (this.hasValidLocalStorageKey()) {
        const currentStorage = JSON.parse(localStorage.getItem(this.getLocalStoragePrefix()));
        this.setWatchedChanges(currentStorage[this.getSelector()]);
      } else {
        this.setWatchedChanges([]);
      }
    }

    this.watchingStarted.next(this.selector);
  }

  /**
   * Create global local storage if it's not defined
   */
  public createGlobalLocalStorage() {
    localStorage.setItem(this.getLocalStoragePrefix(), JSON.stringify([]));
  }

  /**
   * Set local storage key with changes
   */
  public setLocalStorage() {
    const globalStorage = JSON.parse(localStorage.getItem(this.getLocalStoragePrefix()));

    globalStorage[this.getSelector()] = this.getWatchedChanges();
    const objectStorage = Object.assign({}, globalStorage);

    localStorage.setItem(this.getLocalStoragePrefix(), JSON.stringify(objectStorage));
  }

  /**
   * Remove key from local storage
   */
  public removeLocalStorage() {
    const currentStorage = JSON.parse(localStorage.getItem(this.getLocalStoragePrefix()));

    if (currentStorage.hasOwnProperty(this.getSelector())) {
      delete currentStorage[this.getSelector()];
    }

    const objectedStorage = Object.assign({}, currentStorage);
    localStorage.setItem(this.getLocalStoragePrefix(), JSON.stringify(objectedStorage));
  }

  /**
   * Start watching
   *
   * @param selector
   */
  public changeWatchingSelector(selector: string) {
    this.setSelector(selector);
    this.startWatching();
  }

  /**
   * Push new WatchedChange object into watchedChanges variable
   *
   * @param object
   * @param type
   * @param additionalData
   * @param callback
   */
  public pushWatchedChange(object: object, type: ChangeType, additionalData?: {}, callback?) {

    const date = moment();
    const timestamp = parseInt(date.format('X'));

    const watchedChange: WatchedChange = {
      object: object,
      type: type,
      date: date.format('YYYY-MM-DD'),
      time: date.format('HH:mm:ss'),
      timestamp: timestamp,
    };

    if (typeof additionalData !== 'undefined') {
      watchedChange.additionalData = additionalData;
    }

    if (this.order === 'asc') {
      this.getWatchedChanges().push(watchedChange);
    } else {
      this.getWatchedChanges().unshift(watchedChange);
    }

    this.setLocalStorage();

    if (typeof callback === 'function') {
      callback();
    }

    this.itemAdded.next(watchedChange);

    return watchedChange;
  }

  /**
   * Check if local storage exists
   */
  public localStorageExists() {
    return (localStorage.getItem(this.getLocalStoragePrefix()) !== null);
  }

  /**
   * Check if local storage have valid key (selector)
   */
  public hasValidLocalStorageKey() {
    const globalStorage = JSON.parse(localStorage.getItem(this.getLocalStoragePrefix()));

    return (globalStorage.hasOwnProperty(this.getSelector()));
  }

  /**
   * Check if watchedChanges object have items
   */
  public hasChanges() {
    return (Object.keys(this.getWatchedChanges()).length > 0);
  }

  /**
   * Count watched changes
   */
  public countChanges() {
    return this.getWatchedChanges().length;
  }

  /**
   * Clear changes
   */
  public clearChanges() {
    this.setWatchedChanges([]);
    this.removeLocalStorage();

    this.listCleared.next();
  }

  public sendChanges() {

    let errors = false;

    const endpoint = this.getSendEndpoint();
    const changes = this.getWatchedChanges();

    if (typeof endpoint === 'undefined') {
      errors = true;

      let errorTitle = '';
      let errorMessage = '';

      this.translate.get('NO_CHANGES_ENDPOINT_DEFINED_TITLE').subscribe((string) => {
        errorTitle = string;
      });

      this.translate.get('NO_CHANGES_ENDPOINT_DEFINED').subscribe((string) => {
        errorMessage = string;
      });

      this.toastr.error(errorMessage, errorTitle);
    }

    if (errors) {
      return false;
    }

    this.http.post(endpoint, changes).subscribe((response) => {
      console.log(response);
    });

    this.listSent.next();

    this.clearChanges();
  }

  // SETTERS

  /**
   * Set selector var
   *
   * @param selector
   */
  public setSelector(selector: string) {
    this.selector = selector;
  }

  /**
   * Set watchedChanges var
   *
   * @param changes
   */
  public setWatchedChanges(changes: WatchedChange[]) {
    this.watchedChanges = changes;
  }

  /**
   * Set sendEndpoint var
   *
   * @param endpoint
   */
  public setSendEndpoint(endpoint: string) {
    this.sendEndpoint = endpoint;
  }

  /**
   * Set order var
   *
   * @param order
   */
  public setOrder(order: 'desc' | 'asc') {
    this.order = order;
  }

  // GETTERS

  /**
   * Get selector var
   */
  public getSelector() {
    return this.selector;
  }

  /**
   * Get watchedChanges var
   */
  public getWatchedChanges() {
    return this.watchedChanges;
  }

  /**
   * Get localStoragePrefix var
   */
  public getLocalStoragePrefix() {
    return this.localStoragePrefix;
  }

  /**
   * Get sendEndpoint var
   */
  public getSendEndpoint() {
    return this.sendEndpoint;
  }

  /**
   * Get order var
   */
  public getOrder() {
    return this.order;
  }
}
