import { Routes } from '@angular/router';

// 🧍 Employee Components
import { DashboardComponent } from './components/Employee-component/dashboard/dashboard';
import { ProfileComponent } from './components/Employee-component/profile/profile';
import { SalaryComponent } from './components/Employee-component/salary/salary';
import { ConcernsComponent } from './components/Employee-component/concerns/concerns';

// 🏢 Organization Admin Components
import { OrgLoginComponent } from './components/Organization-Admin-component/org-login/org-login';
import { OrgDashboardComponent } from './components/Organization-Admin-component/org-dashboard/org-dashboard';
import { EmployeeManagementComponent } from './components/Organization-Admin-component/employee-management/employee-management';
import { SalaryManagementComponent } from './components/Organization-Admin-component/salary-management/salary-management';
import { DisbursementComponent } from './components/Organization-Admin-component/disbursement/disbursement';
import { TransactionsComponent } from './components/Organization-Admin-component/transactions/transactions';

// 🏦 Bank Admin Components
import { OrganizationsComponent } from './components/Bank-Admin-Component/organizations/organizations';
import { EmployeesComponent } from './components/Bank-Admin-Component/employees/employees';
import { DisbursementsComponent } from './components/Bank-Admin-Component/disbursements/disbursements';
import { CreateAdminComponent } from './components/Bank-Admin-Component/create-admin/create-admin';

// 🧾 Super Admin Components
import { SuperAdminDashboardComponent } from './components/super-admin/dashboard.component/dashboard.component';
import { AddEditBankComponent } from './components/super-admin/bank-add-edit.component/bank-add-edit.component';

// 🏛 Bank Components
import { BankDashboardComponent } from './components/bank-dashboard.component/bank-dashboard.component';

// 🏡 Common Components
import { HomeComponent } from './components/home/home';
import { LoginComponent } from './login/login';

// 🔒 Guard
import { AuthGuard } from './guards/auth.guard';
import { BankAdminComponent } from './components/Bank-Admin-Component/bank-admin/bank-admin';

export const routes: Routes = [
  // 🏠 Default
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },

  // 👤 Employee Routes
  { path: 'login', component: LoginComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent, 
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_EMPLOYEE'] }
  },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard], data: { roles: ['ROLE_EMPLOYEE'] } },
  { path: 'salary', component: SalaryComponent, canActivate: [AuthGuard], data: { roles: ['ROLE_EMPLOYEE'] } },
  { path: 'concerns', component: ConcernsComponent, canActivate: [AuthGuard], data: { roles: ['ROLE_EMPLOYEE'] } },

  // 🏢 Organization Admin Routes
  {
    path: 'org-admin',
    children: [
      { 
        path: 'dashboard', 
        component: OrgDashboardComponent,
        canActivate: [AuthGuard],
        data: { roles: ['ROLE_ORG_ADMIN'] }
      },
      { path: 'employees', component: EmployeeManagementComponent, canActivate: [AuthGuard], data: { roles: ['ROLE_ORG_ADMIN'] } },
      { path: 'salary', component: SalaryManagementComponent, canActivate: [AuthGuard], data: { roles: ['ROLE_ORG_ADMIN'] } },
      { path: 'disbursement', component: DisbursementComponent, canActivate: [AuthGuard], data: { roles: ['ROLE_ORG_ADMIN'] } },
      { path: 'transactions', component: TransactionsComponent, canActivate: [AuthGuard], data: { roles: ['ROLE_ORG_ADMIN'] } },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
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
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // 🏦 Bank Routes
  { 
    path: 'bank', 
    component: BankDashboardComponent,
    canActivate: [AuthGuard],
    data: { roles: ['ROLE_BANK'] }
  },

  // 🏧 Bank Admin Routes
  {
    path: 'bank-admin',
    children: [
      { 
        path: 'dashboard', 
        component: BankAdminComponent,
        canActivate: [AuthGuard],
        data: { roles: ['ROLE_BANK_ADMIN'] }
      },
      { path: 'organizations', component: OrganizationsComponent, canActivate: [AuthGuard], data: { roles: ['ROLE_BANK_ADMIN'] } },
      { path: 'employees', component: EmployeesComponent, canActivate: [AuthGuard], data: { roles: ['ROLE_BANK_ADMIN'] } },
      { path: 'disbursements', component: DisbursementsComponent, canActivate: [AuthGuard], data: { roles: ['ROLE_BANK_ADMIN'] } },
      { path: 'create-admin', component: CreateAdminComponent, canActivate: [AuthGuard], data: { roles: ['ROLE_BANK_ADMIN'] } },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  // 🚫 Fallback
  { path: '**', redirectTo: 'login' }
];
