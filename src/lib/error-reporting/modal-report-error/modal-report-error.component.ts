import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { ErrorReportService } from '../../services/error-report.service';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

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

    // Triggers
    public fetchedStorage = false;
    public fetchedBrowser = false;
    public fetchedData = false;

    constructor(
        public bsModalRef: BsModalRef,
        public errorReportingService: ErrorReportService,
        protected translate: TranslateService,
        protected toastrService: ToastrService
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

        this.localStorageData = this.errorReportingService.fetchLocalStorageData();
        this.browserData = this.errorReportingService.fetchBrowserData();
        this.appData = this.errorReportingService.fetchSystemData();
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

        let stringifiedErrorData = JSON.stringify(errorData);

        let errorMessage = '';

        this.translate.get('ERROR_WAS_REPORTED').subscribe((translatedString: string) => {
            errorMessage = translatedString;
        });

        this.bsModalRef.hide();
        this.toastrService.success(errorMessage);
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

}
