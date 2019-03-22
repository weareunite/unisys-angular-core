import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { BaseApolloService } from './baseApollo.service';

@Injectable({
    providedIn: 'root'
})
export class RoleService extends BaseApolloService{
    protected url = 'role';
    public allPermissions;
    public permissionsChanged = new Subject();
    protected selection = 'id, name';
    protected operationType = 'role';
    protected operationTypePlural = 'roles';

    getAllPermissions(id?: number){

        const apolloInstnc = this.apollo.setOperationName('query')
            .setOperationType(this.operationType)
            .setParams()
            .setPostData({id: id})
            .setSelection('id,name,frontend_permissions{id, name, guard_name, selected },api_permissions{id, name, guard_name, selected }')
            .setMetaData([])
            .setQuery()
            .watchQuery();

        apolloInstnc.subscribe(result => {
            this.setAllPermissions(result.data[this.operationType]);
        });
    }



    setAllPermissions(itemList){
        this.allPermissions = itemList;
        this.permissionsChanged.next(this.allPermissions);
    }
}
