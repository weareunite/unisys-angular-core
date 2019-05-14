import { Injectable } from '@angular/core';
import { UserService } from './user.service';

@Injectable({
    providedIn: 'root'
})
export class BulkService {

    constructor(
        protected userService: UserService
    ) {
    }

    onLogout() {
        this.userService.logOut();
    }
}
