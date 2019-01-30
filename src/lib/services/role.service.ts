import {Injectable} from '@angular/core';

import {BaseService} from './base.service';
import {Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleService extends BaseService {
  protected url = 'role';
  public allPermissions;
  public permissionsChanged = new Subject();

  getAllPermissions($id) {
    return this.http.get(this.url + '/' + $id).subscribe(data => {
      this.setAllPermissions(data['data']);
    });
  }

  setAllPermissions(itemList) {
    this.allPermissions = itemList;
    this.permissionsChanged.next(this.allPermissions);
  }
}
