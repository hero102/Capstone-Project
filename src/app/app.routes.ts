import { Routes } from '@angular/router';

// Employee Components

import { DashboardComponent } from './components/Employee-component/dashboard/dashboard';
import { ProfileComponent } from './components/Employee-component/profile/profile';
import { SalaryComponent } from './components/Employee-component/salary/salary';
import { ConcernsComponent } from './components/Employee-component/concerns/concerns';

// Organization Admin Components
import { OrgLoginComponent } from './components/Organization-Admin-component/org-login/org-login';
import { OrgDashboardComponent } from './components/Organization-Admin-component/org-dashboard/org-dashboard';
import { EmployeeManagementComponent } from './components/Organization-Admin-component/employee-management/employee-management';
import { SalaryManagementComponent } from './components/Organization-Admin-component/salary-management/salary-management';
import { DisbursementComponent } from './components/Organization-Admin-component/disbursement/disbursement';
import { TransactionsComponent } from './components/Organization-Admin-component/transactions/transactions';

// Bank Admin Components (NEW)
//import { BankAdminLoginComponent } from './components/Bank-Admin/login/bank-admin-login/bank-admin-login';
//import { BankAdminDashboardComponent } from './components/Bank-Admin/dashboard/bank-admin-dashboard/bank-admin-dashboard';
import { OrganizationsComponent } from './components/Bank-Admin-Component/organizations/organizations';
import { EmployeesComponent } from './components/Bank-Admin-Component/employees/employees';
import { DisbursementsComponent } from './components/Bank-Admin-Component/disbursements/disbursements';
import { CreateAdminComponent } from './components/Bank-Admin-Component/create-admin/create-admin';
// Guards
import { OrgAdminGuard } from './guards/org-admin-guard';
import { BankAdminLogin } from './components/Bank-Admin-Component/bank-admin-login/bank-admin-login';
import { BankAdminComponent } from './components/Bank-Admin-Component/bank-admin/bank-admin';
import { LoginComponent } from './login/login';


// 🧾 Super Admin Components
import { SuperAdminDashboardComponent } from './components/super-admin/dashboard.component/dashboard.component';
import { AddEditBankComponent } from './components/super-admin/bank-add-edit.component/bank-add-edit.component';

// 🏦 Bank Components
import { BankDashboardComponent } from './components/bank-dashboard.component/bank-dashboard.component';

// Home
import { HomeComponent } from './components/home/home';

// 🔒 Guards
import { AuthGuard } from './guards/auth.guard'; // common guard

export const routes: Routes = [
  // 🏠 Default Route
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },


  // Employee Routes
  { path: 'login', component: LoginComponent},
  { path: 'dashboard', component: DashboardComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'salary', component: SalaryComponent },
  { path: 'concerns', component: ConcernsComponent },

  // Organization Admin Routes
  {
    path: 'org-admin',
    children: [
      { path: 'login', component: OrgLoginComponent },
      { path: 'dashboard', component: OrgDashboardComponent, canActivate: [OrgAdminGuard] },
      { path: 'employees', component: EmployeeManagementComponent, canActivate: [OrgAdminGuard] },
      { path: 'salary', component: SalaryManagementComponent, canActivate: [OrgAdminGuard] },
      { path: 'disbursement', component: DisbursementComponent, canActivate: [OrgAdminGuard] },
      { path: 'transactions', component: TransactionsComponent, canActivate: [OrgAdminGuard] },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },

   // 🧾 Super Admin Routes
  {
    path: 'super-admin',
    children: [
      { 
        path: 'dashboard', 
        component: SuperAdminDashboardComponent,
        canActivate: [AuthGuard],
        data: { roles: ['ROLE_SUPER_ADMIN'] }
      },
      { 
        path: 'bank', 
        component: AddEditBankComponent,
        canActivate: [AuthGuard],
        data: { roles: ['ROLE_SUPER_ADMIN'] }
      },
    ]
  },

  // 🏦 Bank Route
  {
    path: 'bank', 
    component: BankDashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_BANK'] }
  },

  // Bank Admin Routes (NEW)
  {
    path: 'bank-admin',
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: BankAdminLogin },
      { path: 'dashboard', component: BankAdminComponent },
      { path: 'organizations', component: OrganizationsComponent },
      { path: 'employees', component: EmployeesComponent },
      { path: 'disbursements', component: DisbursementsComponent },
      { path: 'create-admin', component: CreateAdminComponent }
    ]
  },

  { path: '**', redirectTo: 'login' }
];
