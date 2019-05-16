import { Injectable } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap';
import { BrowserSupportService } from './browser-support.service';
import { Subject } from 'rxjs';
import { UserService } from './user.service';
import { Router } from '@angular/router';
import { ApolloService } from './apollo.service';

@Injectable({
    providedIn: 'root'
})

export class ErrorReportService {

    public context;

    public fetchedStorage = new Subject();
    public fetchedBrowser = new Subject();
    public fetchedData = new Subject();

    public consoleLog = [];
    public consoleLogLimit = 20;

    constructor(
        public modalService: BsModalService,
        private userService: UserService,
        private router: Router,
        private browserService: BrowserSupportService,
        private apolloService: ApolloService,
    ) {
        this.context = this;
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
            console: this.fetchLastConsoleLog()
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
