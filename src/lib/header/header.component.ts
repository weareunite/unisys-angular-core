import { Component, Inject, OnInit } from '@angular/core';
import { BrowserSupportService } from '../services/browser-support.service';
import { VersionCheckService } from '../services/version-check.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

    valid = null;
    browser = null;
    version = null;

    constructor(
        private browserSupportService: BrowserSupportService,
        public versionCheckControl: VersionCheckService,
        @Inject('env') public environment
    ) {
    }

    ngOnInit() {
        // Check if browser is valid and supported by application
        this.browserSupportService.determineBrowser();

        // Check if application have new version
        // this.versionCheckControl.checkVersion();

        this.setValid(this.browserSupportService.isValid());
        this.setBrowser(this.browserSupportService.getBrowser());
        this.setVersion(this.browserSupportService.getVersion());
    }

    setBrowser(title) {
        this.browser = title;
    }

    setVersion(version) {
        this.version = version;
    }

    setValid(valid: boolean) {
        this.valid = valid;
    }

}
