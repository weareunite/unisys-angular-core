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
import * as html2canvas from 'html2canvas';

@Injectable({
  providedIn: 'root'
})

export class ErrorReportService extends BaseService {

  public context;

  public fetchedStorage = new Subject();
  public fetchedBrowser = new Subject();
  public fetchedData = new Subject();
  public fetchedNetworkData = new Subject();
  public screenshotTaken = new Subject();

  public consoleLog = [];
  public consoleLogLimit = 20;

  public screenshotData = '';
  public networkData;

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
      restCalls: this.fetchLastRestCalls(),
      network: this.networkData
    };

    this.fetchedData.next();

    return appData;
  }


  /**
   * Fetch network data
   */
  fetchNetworkData() {
    this.httpService.externalGet('https://ipapi.co/json/').subscribe(data => {

      this.networkData = data;

      this.httpService.externalGet('http://api.db-ip.com/v2/free/' + this.networkData.ip).subscribe(data => {

        console.log(data);
        // this.fetchedNetworkData.next(data);
      });
    });
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

  /**
   * Take screenshot of screen via html2canvas
   */
  takeScreenshot() {

    let self = this;

    // @ts-ignore
    html2canvas(document.body).then(function (canvas) {
      let data = canvas.toDataURL('image/png');
      self.screenshotData = data;
      self.screenshotTaken.next(data);
    });
  }

  /**
   * Upload screenshot associated with ErrorReport
   *
   * @param id ID of error report
   * @param data Image data
   */
  uploadScreenshot(id: number, data: string) {

    const requestUlr = this.url + '/' + id + '/addFile';
    const formData = new FormData();
    formData.append('file', data);
    this.http.upload(requestUlr, formData).subscribe(data => {
      console.log(data);
    });

    return false;
  }
}
