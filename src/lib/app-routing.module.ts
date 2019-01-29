import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AuthGuard} from './services/auth-guard.service';
import {DefaultModule} from './default/default.module';
import {SettingsModule} from './admin/settings/settings.module';
import {UsersModule} from './admin/users/users.module';
import {BankAccountModule} from './admin/bank-account/bank-account.module';

// Workaround for lazy load modules
export function proxyDefaultModule() {return DefaultModule;}
export function proxyAdminBankAccountModule(){return BankAccountModule;}
export function proxySettingsModule(){return SettingsModule;}
export function proxyUsersModule(){return UsersModule};

const appRoutes: Routes = [
  {path: '', redirectTo: 'default', pathMatch: 'full'},
  {path: 'default', loadChildren: proxyDefaultModule},
  {path: 'admin/bank-account', loadChildren: proxyAdminBankAccountModule},
  // {path: 'admin/category', loadChildren: './admin/category/category.module#CategoryModule'},
  // {path: 'admin/roles', loadChildren: './admin/role/role.module#RoleModule'},
  {path: 'admin/settings', loadChildren: proxySettingsModule},
  // {path: 'admin/tags', loadChildren: './admin/tags/tags.module#TagsModule'},
  {path: 'admin/user', loadChildren: proxyUsersModule},
  // {path: 'contact', loadChildren: './contact/contact.module#ContactModule'},
  // {path: 'draw', loadChildren: './draw/draw.module#DrawModule'},
  // {path: 'expense', loadChildren: './expense/expense.module#ExpenseModule'},
  // {path: 'grant', loadChildren: './grant/grant.module#GrantModule'},
  // {path: 'project', loadChildren: './project/project.module#ProjectModule'},
  // {path: 'transaction', loadChildren: './transaction/transaction.module#TransactionModule'},
  // {path: 'cofinance', loadChildren: './cofinance/cofinance.module#CofinanceModule'},
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ],
  providers: [
    AuthGuard
  ]
})
export class AppRoutingModule {

}
