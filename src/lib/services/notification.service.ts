import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { Subject } from 'rxjs/index';
import {BaseService} from './base.service';

@Injectable()
export class NotificationService extends BaseService{
    listUnreadChanged = new Subject();
    adminListChanged = new Subject();
    adminList;

    getUserUnreadList() {
        const url = 'user/unreadNotifications';

        this.http.get(url).subscribe(data => {
            this.setUnreadList(data['data']);
        });
    }

    getUserList() {
        const url = 'user/notifications';

        this.http.get(url).subscribe(data => {
            this.setItemList(data['data']);
        });
    }

    setUserReadAll() {
        const url = 'user/markAllNotificationsAsRead';

        this.http.put(url, {}).subscribe(data => {
            this.getUserList();
        });
    }

    getAdminList(userId: number) {
        const url = 'user/' + userId + '/notifications';

        this.http.get(url).subscribe(data => {
            this.setAdminList(data['data']);
        });
    }

    setReadState(uid, state) {
        let requestUlr = 'userNotification/' + uid;

        if (state) {
            requestUlr = requestUlr + '/markAsRead';
        } else {
            requestUlr = requestUlr + '/markAsUnread';
        }

        this.http.put(requestUlr, {}).subscribe(data => {
            this.getUserList();
            this.getUserUnreadList();
        });
    }

    setAdminList(itemList) {
        this.adminList = itemList;
        this.adminListChanged.next(this.adminList);
    }

    setUnreadList(itemList) {
        this.itemList = itemList;
        this.listUnreadChanged.next(this.itemList);
    }

}
