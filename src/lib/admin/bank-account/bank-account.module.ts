import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BankAccountComponent } from './bank-account.component';
import { AdminBankAccountRoutingModule } from './bank-account-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { ModalEditComponent } from './modal-edit/modal-edit.component';
import {NgxPermissionsModule} from 'ngx-permissions';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    AdminBankAccountRoutingModule,
    NgxPermissionsModule.forChild(),
  ],
  declarations: [
    BankAccountComponent,
    ModalEditComponent,
  ],
  entryComponents: [
    ModalEditComponent,
  ],
})
export class BankAccountModule { }
