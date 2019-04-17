import { Component, Input, OnInit } from '@angular/core';
import { VersionCheckService } from '../services/version-check.service';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
    @Input() footerYears: string;

    constructor(
        public versionCheckService: VersionCheckService,
    ) {
    }

    ngOnInit() {
        const currentYear = new Date().getFullYear().toString();
        if (!this.footerYears) {
            this.footerYears = currentYear;
        }
    }

}
