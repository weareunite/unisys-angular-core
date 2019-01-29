import { catchError, map} from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';

import {AppStateService} from './app-state.service';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';

@Injectable()
export class InterceptorService implements HttpInterceptor {

    constructor(
        protected toastrService: ToastrService,
        protected appState : AppStateService,
        protected translate: TranslateService,
    ){}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        // ZMENIM SYSTEM PRIDAVANIA HLAVICKY

        // const token: string = localStorage.getItem('token');

        // if (token) {
        //     request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + token) });
        // }
        //
        // if (!request.headers.has('Content-Type')) {
        //     request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
        // }
        //
        // request = request.clone({ headers: request.headers.set('Accept', 'application/json') });

        this.appState.addRequest(request);
        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    this.appState.removeRequest(request);
                    switch(request.method) {
                        case "PUT":
                            this.translate.get('ITEM_HAS_BEEN_SAVED').subscribe((res: string) => {
                                this.toastrService.success('',res);
                            });
                            break;
                        case "POST":
                            this.translate.get('ITEM_HAS_BEEN_CREATED').subscribe((res: string) => {
                                this.toastrService.success('',res);
                            });
                            break;
                        case "DELETE":
                            this.translate.get('ITEM_HAS_BEEN_DELETED').subscribe((res: string) => {
                                this.toastrService.error('',res);
                            });

                    }
                }
                return event;
            }),catchError((response: any) => {
                if (response instanceof HttpErrorResponse) {
                    let htmlToReturn = '';
                    console.log(response);
                    if(response.error.errors){
                        Object.keys(response.error.errors).forEach(function(key){
                            this.translate.get(response.error.errors[key][0]).subscribe((message: string) => {
                                htmlToReturn = htmlToReturn+message+'<br>';
                            });
                        }.bind( this ));
                    }else if(response.error.message){
                        this.translate.get(response.error.message).subscribe((message: string) => {
                            htmlToReturn = htmlToReturn+message+'<br>';
                        });
                    }

                    this.translate.get(response.statusText).subscribe((title: string) => {
                        this.toastrService.error(htmlToReturn,title,{enableHtml:true});
                        this.appState.removeRequest(request);
                    });
                }
                return throwError(response);
            }));
    }
}
