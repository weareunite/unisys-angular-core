import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AuthGuard} from '../services/auth-guard.service';

const appRoutes: Routes = [
  {path: '', redirectTo: 'default', pathMatch: 'full'},
  // {path: 'default', loadChildren: './default/default.module#DefaultModule'},
  // {path: 'admin/bank-account', loadChildren: './admin/bank-account/bank-account.module#BankAccountModule'},
  // {path: 'admin/category', loadChildren: './admin/category/category.module#CategoryModule'},
  // {path: 'admin/roles', loadChildren: './admin/role/role.module#RoleModule'},
  // {path: 'admin/settings', loadChildren: './admin/settings/settings.module#SettingsModule'},
  // {path: 'admin/tags', loadChildren: './admin/tags/tags.module#TagsModule'},
  // {path: 'admin/user', loadChildren: './admin/users/users.module#UsersModule'},
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
