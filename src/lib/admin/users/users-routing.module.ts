import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NgxPermissionsGuard} from 'ngx-permissions';

import {AuthGuard} from '../../services/auth-guard.service';
import {UsersComponent} from './users.component';

const adminUsersRoutes: Routes = [
    {path: 'user', component: UsersComponent,
        children: [
            {
                path: 'user', component : UsersComponent, canActivate: [NgxPermissionsGuard, AuthGuard],
                data: { permissions: { only: ['admin.users'], redirectTo: ''}}
            },
        ] },
];

@NgModule({
    imports: [
        RouterModule.forChild(adminUsersRoutes)
    ],
    exports: [RouterModule]
})
export class AdminUsersRoutingModule{}
