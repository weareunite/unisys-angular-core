import {Component, OnInit} from '@angular/core';
import {BsModalRef} from 'ngx-bootstrap';
import {ErrorReportService} from '../../services/error-report.service';
import {Subscription} from 'rxjs';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {HttpService} from '../../services/http.service';

@Component({
  selector: 'lib-modal-report-error',
  templateUrl: './modal-report-error.component.html',
  styleUrls: ['./modal-report-error.component.scss']
})
export class ModalReportErrorComponent implements OnInit {

  // Scope variables
  public localStorageData;
  public browserData;
  public appData;

  // Subscriptions
  public fetchedStorageSubscription: Subscription;
  public fetchedBrowserSubscription: Subscription;
  public fetchedDataSubscription: Subscription;
  public fetchedNetworkDataSubscription: Subscription;
  public fetchedLocationSubscription: Subscription;
  public deniedLocationSubscription: Subscription;

  // Triggers
  public fetchedStorage = false;
  public fetchedBrowser = false;
  public fetchedData = false;
  public fetchedLocation = false;
  public locationDisabled = false;

  constructor(
    public bsModalRef: BsModalRef,
    public errorReportingService: ErrorReportService,
    protected translate: TranslateService,
    protected toastrService: ToastrService,
    protected httpService: HttpService
  ) {
  }

  ngOnInit() {
    this.fetchedStorageSubscription = this.errorReportingService.fetchedStorage.subscribe(() => {
      this.setFetchedStorage(true);
      this.fetchedStorageSubscription.unsubscribe();
    });

    this.fetchedBrowserSubscription = this.errorReportingService.fetchedBrowser.subscribe(() => {
      this.setFetchedBrowser(true);
      this.fetchedBrowserSubscription.unsubscribe();
    });

    this.fetchedDataSubscription = this.errorReportingService.fetchedData.subscribe(() => {
      this.setFetchedData(true);
      this.fetchedDataSubscription.unsubscribe();
    });

    this.fetchedNetworkDataSubscription = this.errorReportingService.fetchedNetworkData.subscribe((data) => {
      this.appData = this.errorReportingService.fetchSystemData();
    });

    this.fetchedLocationSubscription = this.errorReportingService.fetchedLocation.subscribe((location) => {
      this.appData.location = {};
      this.appData.location['latitude'] = location['coords']['latitude'];
      this.appData.location['longitude'] = location['coords']['longitude'];
      this.setFetchedLocation(true);
    });

    this.deniedLocationSubscription = this.errorReportingService.deniedLocation.subscribe(() => {
      this.setDisabledLocation(true);
    });

    this.errorReportingService.fetchNetworkData();
    this.localStorageData = this.errorReportingService.fetchLocalStorageData();
    this.browserData = this.errorReportingService.fetchBrowserData();

  }

  /**
   * Send error into database and send notification emiail
   *
   * @param issue Issue from modal window
   */
  sendError(issue: string = '') {
    let browserData = this.browserData;
    let appData = this.appData;
    let localStorageData = this.localStorageData;
    let screenshotData = this.errorReportingService.screenshotData;

    let errorData = {
      issue: issue,
      browser: browserData,
      application: appData,
      localStorage: localStorageData,
      datetime: {
        date: new Date(),
        timestamp: new Date().getTime()
      }
    };

    let stringifiedErrorData = {content: JSON.stringify(errorData)};

    let url = 'errorReports';

    this.httpService.post(url, stringifiedErrorData).subscribe((data) => {

      let id = data['id'];
      this.errorReportingService.uploadScreenshot(id, screenshotData);

      let errorMessage = '';

      this.translate.get('ERROR_WAS_REPORTED').subscribe((translatedString: string) => {
        errorMessage = translatedString;
      });

      this.bsModalRef.hide();
      this.toastrService.success(errorMessage);
    });

  }

  /**
   * Set fetchedBrowser var
   *
   * @param state State
   */
  setFetchedBrowser(state: boolean) {
    this.fetchedBrowser = state;
  }

  /**
   * Set fetchedStorage var
   *
   * @param state State
   */
  setFetchedStorage(state: boolean) {
    this.fetchedStorage = state;
  }

  /**
   * Set fetchedData var
   *
   * @param state State
   */
  setFetchedData(state: boolean) {
    this.fetchedData = state;
  }

  setFetchedLocation(state: boolean) {
    this.fetchedLocation = state;
  }

  setDisabledLocation(state: boolean) {
    this.locationDisabled = state;
  }

}
