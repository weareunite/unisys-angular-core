import {Injectable} from '@angular/core';

import {BaseService} from './base.service';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PermissionService extends BaseService {
  protected url = 'permission';
  public allPermissions;
  public permissionsChanged = new Subject();

  getAllPermissions() {
    return this.http.get(this.url).subscribe(data => {
      this.setAllPermissions(data['data']);
    });
  }

  setAllPermissions(itemList) {
    this.allPermissions = itemList;
    this.permissionsChanged.next(this.allPermissions);
  }
}
