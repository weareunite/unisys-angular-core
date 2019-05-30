import {Injectable} from '@angular/core';
import {BsModalService} from 'ngx-bootstrap';
import {BrowserSupportService} from './browser-support.service';
import {Subject} from 'rxjs';
import {UserService} from './user.service';
import {Router} from '@angular/router';
import {ApolloService} from './apollo.service';
import {BaseService} from './base.service';
import {AuthService} from './auth.service';
import {HttpService} from './http.service';
import {UnisysAngularAppStateServiceService} from '@weareunite/unisys-angular-app-state-service';

@Injectable({
  providedIn: 'root'
})

export class ErrorReportService extends BaseService {

  public context;

  public fetchedStorage = new Subject();
  public fetchedBrowser = new Subject();
  public fetchedData = new Subject();

  public consoleLog = [];
  public consoleLogLimit = 20;

  constructor(
    protected auth: AuthService,
    protected http: HttpService,
    protected apollo: ApolloService,
    protected appStateService: UnisysAngularAppStateServiceService,
    public modalService: BsModalService,
    private userService: UserService,
    private router: Router,
    private browserService: BrowserSupportService,
    private apolloService: ApolloService,
    private httpService: HttpService
  ) {
    super(http, appStateService, apollo);
    this.context = this;
    this.url = 'errorReports';
  }

  /**
   * Get data from local storage
   */
  fetchLocalStorageData() {
    this.fetchedStorage.next();
    return localStorage;
  }

  /**
   * Get browser data as version, browser and validity etc.
   */
  fetchBrowserData() {
    this.fetchedBrowser.next();

    let userAgent = this.browserService.getUserAgent();
    let version = this.browserService.getVersion();
    let browser = this.browserService.getBrowser();
    let isValid = this.browserService.isValid();

    return {
      userAgent: userAgent,
      browser: browser,
      version: version,
      isValid: isValid
    };
  }

  /**
   * Fetch system data as user object, url etc.
   */
  fetchSystemData() {

    let appData = {
      user: this.userService.getUser(),
      url: this.router.url,
      latestCalls: this.fetchLastApolloCalls(),
      console: this.fetchLastConsoleLog(),
      restCalls: this.fetchLastRestCalls()
    };

    this.fetchedData.next();

    return appData;
  }

  /**
   * Fetch latest Apollo calls via GraphQL
   */
  fetchLastApolloCalls() {
    return this.apolloService.lastApolloCalls;
  }

  fetchLastRestCalls() {
    return this.httpService.lastRestCalls;
  }

  /**
   * Fetch latest console log
   */
  fetchLastConsoleLog() {
    return this.consoleLog;
  }

  /**
   * Push log into global console log
   *
   * @param log Log to be added
   */
  pushIntoConsoleLog(log) {
    if (Object.keys(this.consoleLog).length === this.consoleLogLimit) {
      this.consoleLog.shift();
    }

    this.consoleLog.push(log);
  }
}
