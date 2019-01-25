import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import {environment} from '../enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
    private  url = environment.BASE_API_URL;

    constructor(
        protected http: HttpClient,
        protected auth: AuthService,
    ) {}

    get(serviceUrl: string) {
        return this.http.get(this.url + serviceUrl, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + this.auth.getAccessToken(),
            })
        });
    }

    post(serviceUrl: string, data) {
        return this.http.post(this.url + serviceUrl, data, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + this.auth.getAccessToken(),
            })
        });
    }

    download(requestUrl: string, type:string, filename:string) {
        let url = requestUrl;
        if(!requestUrl.includes("://")){
            url = this.url + requestUrl;
        }
        this.http.get(url, {
                headers: new HttpHeaders({
                    'responseType': 'ResponseContentType.BLob',
                    'Authorization': 'Bearer ' + this.auth.getAccessToken(),
                }),
                responseType: 'blob',
        }).subscribe(data => {
            this.createAndDownloadBlobFile(data,{ type: type },filename)
        });
    }

    public createAndDownloadBlobFile(body, options, filename) {
        var blob = new Blob([body], options);
        if (navigator.msSaveBlob)
        {
            // IE 10+
            navigator.msSaveBlob(blob, filename);
        }
        else
        {
            var link = document.createElement('a');
            // Browsers that support HTML5 download attribute
            if (link.download !== undefined)
            {
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
        return this.http
            .post(this.url + serviceUrl, data, {
                headers : new HttpHeaders({
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + this.auth.getAccessToken(),
                })
            });
    }

    put(serviceUrl: string, data) {
        return this.http.put(this.url + serviceUrl, data, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + this.auth.getAccessToken(),
            })
        });
    }

    delete(serviceUrl: string) {
        return this.http.delete(this.url + serviceUrl, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + this.auth.getAccessToken(),
            })
        });
    }

    search(serviceUrl: string, query: string) {
        return this.http.get(this.url + serviceUrl + '?q=' + query, {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + this.auth.getAccessToken(),
            })
        });
    }
}
