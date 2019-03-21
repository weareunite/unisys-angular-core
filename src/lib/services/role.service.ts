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
        const operationType = 'permissions';

        const apolloInstnc = this.apollo.setOperationName('query')
            .setOperationType(operationType)
            .setParams()
            .setSelection(this.selection, 'data')
            .setMetaData()
            .setQuery()
            .watchQuery();


        apolloInstnc.subscribe(result => {
            this.setAllPermissions(result.data[operationType].data);
        });
    }

    setAllPermissions(itemList){
        this.allPermissions = itemList;
        this.permissionsChanged.next(this.allPermissions);
    }
}
