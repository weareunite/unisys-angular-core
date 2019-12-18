import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Inject, Injectable} from '@angular/core';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    protected http: HttpClient,
    protected auth: AuthService,
    @Inject('env') private env,
  ) {
  }

  private url = this.env.BASE_API_URL;
  public lastRestCalls = [];
  private lastRestCallsLimit = 10;

  externalGet(serviceUrl: string) {
    this.pushIntoLatestCall('GET', serviceUrl, {});
    return this.http.get(serviceUrl, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
    });
  }

  streamImage(serviceUrl: string) {
    this.pushIntoLatestCall('GET', serviceUrl, {});
    return this.http.get(this.url + serviceUrl, {
      headers: new HttpHeaders({
        'responseType': 'ResponseContentType.BLob',
        'Authorization': 'Bearer ' + this.auth.getAccessToken(),
      }),
      responseType: 'arraybuffer'
    });
  }

  get(serviceUrl: string, useBase: boolean = true) {
    let url = this.url + serviceUrl;
    if (!useBase) {
      url = serviceUrl;
    }
    this.pushIntoLatestCall('GET', serviceUrl, {});
    return this.http.get(url, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + this.auth.getAccessToken(),
      })
    });
  }

  post(serviceUrl: string, data) {
    this.pushIntoLatestCall('POST', serviceUrl, data);
    return this.http.post(this.url + serviceUrl, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + this.auth.getAccessToken(),
      })
    });
  }

  download(requestUrl: string, type: string, filename: string, method: string = 'get', data = {}) {
    this.pushIntoLatestCall('DOWNLOAD', requestUrl, data);
    let url = requestUrl;
    if (!requestUrl.includes('://')) {
      url = this.url + requestUrl;
    }

    switch (method) {
      case 'get':
        this.http.get(url, {
          headers: new HttpHeaders({
            'responseType': 'ResponseContentType.BLob',
            'Authorization': 'Bearer ' + this.auth.getAccessToken(),
          }),
          responseType: 'blob',
        }).subscribe(data => {
          this.createAndDownloadBlobFile(data, {type: type}, filename);
        });
        break;
      case 'post':
        this.http.post(url, data, {
          headers: new HttpHeaders({
            'responseType': 'ResponseContentType.BLob',
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + this.auth.getAccessToken(),
          }),
          responseType: 'blob',
        }).subscribe(data => {
          this.createAndDownloadBlobFile(data, {type: type}, filename);
        });
        break;
    }
  }

  public imageEncode(arrayBuffer) {
    let u8 = new Uint8Array(arrayBuffer);
    let b64encoded = btoa([].reduce.call(new Uint8Array(arrayBuffer), function (p, c) {
      return p + String.fromCharCode(c);
    }, ''));
    let mimetype = 'image/jpeg';
    return 'data:' + mimetype + ';base64,' + b64encoded;
  }

  public createAndDownloadBlobFile(body, options, filename) {
    var blob = new Blob([body], options);
    if (navigator.msSaveBlob) {
      // IE 10+
      navigator.msSaveBlob(blob, filename);
    } else {
      var link = document.createElement('a');
      // Browsers that support HTML5 download attribute
      if (link.download !== undefined) {
        var url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }

  upload(serviceUrl: string, data) {
    this.pushIntoLatestCall('UPLOAD', serviceUrl, data);
    return this.http
      .post(this.url + serviceUrl, data, {
        headers: new HttpHeaders({
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + this.auth.getAccessToken(),
        })
      });
  }

  put(serviceUrl: string, data) {
    this.pushIntoLatestCall('PUT', serviceUrl, data);
    return this.http.put(this.url + serviceUrl, data, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + this.auth.getAccessToken(),
      })
    });
  }

  delete(serviceUrl: string) {
    this.pushIntoLatestCall('DELETE', serviceUrl, {});
    return this.http.delete(this.url + serviceUrl, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + this.auth.getAccessToken(),
      })
    });
  }

  search(serviceUrl: string, query: string) {
    this.pushIntoLatestCall('SEARCH', serviceUrl, {query: query});
    return this.http.get(this.url + serviceUrl + '?q=' + query, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + this.auth.getAccessToken(),
      })
    });
  }

  pushIntoLatestCall(method, url, data) {
    if (Object.keys(this.lastRestCalls).length === this.lastRestCallsLimit) {
      this.lastRestCalls.shift();
    }

    this.lastRestCalls.push({method: method, url: url, data: data});
  }
}
