import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BrowserSupportService {

  public browser;
  public version;
  public userAgent;

  constructor() {
  }

  /**
   * Determine browser and set basic data as version, browser and user agent
   */
  public determineBrowser() {

    var ua = navigator.userAgent, tem,
      M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(M[1])) {
      tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
      return 'IE ' + (tem[1] || '');
    }
    if (M[1] === 'Chrome') {
      tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
      if (tem != null) {
        M = tem;
        tem.slice(1).join(' ').replace('OPR', 'Opera');
      }
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) {
      M.splice(1, 1, tem[1]);
    }

    if (typeof M !== 'undefined' && M !== null) {
      this.setBrowser(M[0]);
      this.setVersion(M[1]);
    }

    this.setUserAgent(navigator.userAgent);
  }

  /**
   * Check if browser version is valid via version
   */
  public isValid() {
    let browser = this.browser;
    let version = parseInt(this.version);

    let valid = null;

    if (browser === 'Chrome') {
      if (version >= 70) { // TODO this could be in enviroment
        valid = true;
      }
    } else if (browser === 'Firefox') {
      if (version >= 60) {
        valid = true;
      }
    } else if (browser === 'MSIE') {
      if (version >= 9) {
        valid = true;
      }
    } else if (browser === 'Safari') {
      if (version >= 10) {
        valid = true;
      }
    } else if (browser === 'Edge') {
      if (version >= 12) {
        valid = true;
      }
    } else if (browser === 'OPR') {
      if (version >= 55) {
        valid = true;
      }
    }

    return valid;

  }

  /**
   * Get browser version
   */
  public getVersion() {
    return this.version;
  }

  /**
   * Get browser
   */
  public getBrowser() {
    return this.browser;
  }

  /**
   * Get user agent
   */
  public getUserAgent() {
    return this.userAgent;
  }

  /**
   * Set browser
   *
   * @param browser Browser
   */
  public setBrowser(browser) {
    this.browser = browser;
  }

  /**
   * Set version
   *
   * @param version Version
   */
  public setVersion(version) {
    this.version = version;
  }

  /**
   * Set user agent
   *
   * @param userAgent User agent
   */
  public setUserAgent(userAgent) {
    this.userAgent = userAgent;
  }

}
