// src/app/components/super-admin/super-admin.routes.ts
import { Routes } from '@angular/router';
import { SuperAdminDashboardComponent } from './dashboard.component/dashboard.component';
import { BankListComponent } from './bank-list.component/bank-list.component';
import { AddEditBankComponent} from './bank-add-edit.component/bank-add-edit.component';


export const SUPERADMIN_ROUTES: Routes = [
  { path: 'dashboard', component: SuperAdminDashboardComponent },
  { path: 'banks', component: BankListComponent },
  { path: 'banks/add', component: AddEditBankComponent },
  { path: 'banks/edit/:id', component: AddEditBankComponent }
];
