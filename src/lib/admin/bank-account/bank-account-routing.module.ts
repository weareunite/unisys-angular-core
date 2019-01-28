import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NgxPermissionsGuard} from 'ngx-permissions';

import {BankAccountComponent} from './bank-account.component';
import {AuthGuard} from '../../auth/auth-guard.service';

const adminBankAccontRoutes: Routes = [
    {path: '', component: BankAccountComponent,
        children: [
            {
                path: '', component : BankAccountComponent, canActivate: [NgxPermissionsGuard, AuthGuard],
                data: { permissions: { only: ['admin.bank-account'], redirectTo: ''}}
        },
    ] },
];

@NgModule({
    imports: [
        RouterModule.forChild(adminBankAccontRoutes)
    ],
    exports: [RouterModule]
})
export class AdminBankAccountRoutingModule {}
