import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import { BaseApolloService } from './baseApollo.service';

@Injectable({
  providedIn: 'root'
})
export class RoleService extends BaseApolloService {
  protected url = 'role';
  public allPermissions;
  public permissionsChanged = new Subject();
  protected selection = 'id, name, surname, username, email, roles {id, name}, frontend_permissions {id, name}';
  protected operationType = 'role';
  protected operationTypePlural = 'roles';

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
