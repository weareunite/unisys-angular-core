import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpResponse, HttpErrorResponse } from '@angular/common/http';

import { UnisysAngularAppStateServiceService } from '@weareunite/unisys-angular-app-state-service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from './user.service';

@Injectable({
    providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

    constructor(
        protected toastrService: ToastrService,
        protected appState: UnisysAngularAppStateServiceService,
        protected translate: TranslateService,
        protected userService: UserService
    ) {
    }

    /**
     * Translate error from server and add prefix 'ERROR_' before translation string
     *
     * @param error Error message from server
     */
    translateError(error: string) {

        let errorMessage = '';

        if (typeof error !== 'undefined') {
            let legacyError = error;

            error = error.toUpperCase();
            error = error.split(' ').join('_');
            error = 'ERROR_' + error;

            this.translate.get(error).subscribe((translatedString: string) => {
                errorMessage = translatedString;
            });

            if (errorMessage === error) {
                errorMessage = legacyError;
            }
        }

        return errorMessage;

    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        this.appState.addRequest(request);
        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                    this.appState.removeRequest(request);
                    // switch(request.method) {
                    //     case "PUT":
                    //         this.translate.get('ITEM_HAS_BEEN_SAVED').subscribe((res: string) => {
                    //             this.toastrService.success('',res);
                    //         });
                    //         break;
                    //     case "POST":
                    //         this.translate.get('ITEM_HAS_BEEN_CREATED').subscribe((res: string) => {
                    //             this.toastrService.success('',res);
                    //         });
                    //         break;
                    //     case "DELETE":
                    //         this.translate.get('ITEM_HAS_BEEN_DELETED').subscribe((res: string) => {
                    //             this.toastrService.error('',res);
                    //         });
                    //
                    // }
                }
                return event;
            }), catchError((response: any) => {
                if (response instanceof HttpErrorResponse) {
                    let htmlToReturn = '';
                    if (response.error.errors) {
                        Object.keys(response.error.errors).forEach(function (key) {
                            htmlToReturn = this.translateError(response.error.errors[key][0]);
                        }.bind(this));
                    } else if (response.error.message) {
                        htmlToReturn = this.translateError(response.error.message);
                    }

                    let title = this.translateError(response.statusText);
                    let status = response.status;

                    if (status === 401) {
                        this.userService.logOut();
                    }

                    this.toastrService.error(htmlToReturn, title, {enableHtml: true});
                    this.appState.removeRequest(request);
                }
                return throwError(response);
            }));
    }
}
