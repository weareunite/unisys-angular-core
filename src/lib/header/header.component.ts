import { Component, Inject, OnInit } from '@angular/core';
import { BrowserSupportService } from '../services/browser-support.service';

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
    @Inject('env') public environment
  ) {
  }

  ngOnInit() {
    this.browserSupportService.determineBrowser();
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
