// // src/app/components/org-admin/employee-management/employee-management.component.ts

// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { OrgAdminService } from '../services/org-admin';
// import { Employee, EmployeeFormData, BankAccount } from '../models/org-admin.model';

// @Component({
//   selector: 'app-employee-management',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './employee-management.html',
//    styleUrls: ['./employee-management.scss']
// })
// export class EmployeeManagementComponent implements OnInit {
//   employees: Employee[] = [];
//   showAddForm = false;
//   showOnlyMyEmployees = true;
//   selectedEmployee: Employee | null = null;
//   modalType: 'account' | 'salary' | null = null;
//   message = '';
//   messageType = '';
//   loading = false;

//   newEmployee: EmployeeFormData = {
//     name: '',
//     email: '',
//     phoneNumber: '',
//     designation: '',
//     department: ''
//   };

//   selectedFile: File | null = null;

//   bankAccount: BankAccount = {
//     bankName: '',
//     branch: '',
//     ifscCode: '',
//     accountNumber: '',
//     status: 'PENDING_APPROVAL'
//   };

//   salary: any = {
//     basicSalary: 0,
//     hra: 0,
//     allowances: 0,
//     deductions: 0,
//     netSalary: 0
//   };

//   constructor(private orgAdminService: OrgAdminService) {}

//   ngOnInit(): void {
//     this.loadEmployees();
//   }

//   loadEmployees(): void {
//     const orgAdmin = this.orgAdminService.getCurrentOrgAdmin();
//     if (!orgAdmin) return;

//     const request = this.showOnlyMyEmployees
//       ? this.orgAdminService.getEmployeesByAdmin(orgAdmin.organizationId, orgAdmin.orgAdminId)
//       : this.orgAdminService.getAllEmployees(orgAdmin.organizationId);

//     request.subscribe({
//       next: (data) => {
//         this.employees = data;
//         console.log('✅ Loaded employees:', data);
//       },
//       error: (err) => {
//         console.error('Error loading employees:', err);
//         this.showMessage('Failed to load employees', 'error');
//       }
//     });
//   }

//   onFileSelect(event: any): void {
//     const file = event.target.files[0];
//     if (file) {
//       if (file.size > 5 * 1024 * 1024) {
//         this.showMessage('File size must be less than 5MB', 'error');
//         event.target.value = '';
//         return;
//       }
//       this.selectedFile = file;
//     }
//   }

//   formatFileSize(bytes: number): string {
//     if (bytes < 1024) return bytes + ' B';
//     if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
//     return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
//   }

//   addEmployee(): void {
//     const orgAdmin = this.orgAdminService.getCurrentOrgAdmin();
//     if (!orgAdmin || !this.selectedFile) return;

//     this.loading = true;
//     this.message = '';

//     const employeeData: EmployeeFormData = {
//       ...this.newEmployee,
//       document: this.selectedFile
//     };

//     this.orgAdminService.addEmployee(orgAdmin.orgAdminId, employeeData).subscribe({
//       next: (emp) => {
//         this.loading = false;
//         this.showMessage('✅ Employee added successfully! Pending Bank Admin approval.', 'success');
//         this.resetForm();
//         this.loadEmployees();
//         this.showAddForm = false;
//       },
//       error: (err) => {
//         this.loading = false;
//         this.showMessage(err.error?.message || '❌ Failed to add employee', 'error');
//       }
//     });
//   }

//   resetForm(): void {
//     this.newEmployee = {
//       name: '',
//       email: '',
//       phoneNumber: '',
//       designation: '',
//       department: ''
//     };
//     this.selectedFile = null;
//     this.message = '';
//   }

//   selectEmployee(emp: Employee, type: 'account' | 'salary'): void {
//     this.selectedEmployee = emp;
//     this.modalType = type;
//     this.message = '';
//   }

//   closeModal(): void {
//     this.selectedEmployee = null;
//     this.modalType = null;
//     this.message = '';
//     this.bankAccount = {
//       bankName: '',
//       branch: '',
//       ifscCode: '',
//       accountNumber: '',
//       status: 'PENDING_APPROVAL'
//     };
//     this.salary = {
//       basicSalary: 0,
//       hra: 0,
//       allowances: 0,
//       deductions: 0,
//       netSalary: 0
//     };
//   }

//   addBankAccount(): void {
//     const orgAdmin = this.orgAdminService.getCurrentOrgAdmin();
//     if (!orgAdmin || !this.selectedEmployee) return;

//     this.loading = true;
//     this.message = '';

//     this.orgAdminService.addEmployeeAccount(
//       orgAdmin.orgAdminId,
//       this.selectedEmployee.employeeId!,
//       this.bankAccount
//     ).subscribe({
//       next: (acc) => {
//         this.loading = false;
//         this.showMessage('✅ Bank account added successfully!', 'success');
//         setTimeout(() => {
//           this.closeModal();
//           this.loadEmployees();
//         }, 1500);
//       },
//       error: (err) => {
//         this.loading = false;
//         this.showMessage(err.error?.message || '❌ Failed to add bank account', 'error');
//       }
//     });
//   }

//   createSalary(): void {
//     const orgAdmin = this.orgAdminService.getCurrentOrgAdmin();
//     if (!orgAdmin || !this.selectedEmployee) return;

//     this.loading = true;
//     this.message = '';

//     this.orgAdminService.createSalary(
//       orgAdmin.orgAdminId,
//       this.selectedEmployee.employeeId!,
//       this.salary
//     ).subscribe({
//       next: (sal) => {
//         this.loading = false;
//         this.showMessage('✅ Salary created successfully! Employee is now ACTIVE.', 'success');
//         setTimeout(() => {
//           this.closeModal();
//           this.loadEmployees();
//         }, 1500);
//       },
//       error: (err) => {
//         this.loading = false;
//         this.showMessage(err.error?.message || '❌ Failed to create salary', 'error');
//       }
//     });
//   }

//   calculateNetSalary(): void {
//     const basic = this.salary.basicSalary || 0;
//     const hra = this.salary.hra || 0;
//     const allowances = this.salary.allowances || 0;
//     const deductions = this.salary.deductions || 0;
//     this.salary.netSalary = basic + hra + allowances - deductions;
//   }

//   getStatusLabel(status: string | undefined): string {
//     const labels: any = {
//       'PENDING_APPROVAL': '⏳ Pending',
//       'APPROVED': '✅ Approved',
//       'ACTIVE': '🟢 Active',
//       'REJECTED': '❌ Rejected'
//     };
//     return labels[status || ''] || status || 'Unknown';
//   }

//   showMessage(msg: string, type: string): void {
//     this.message = msg;
//     this.messageType = type;
//     setTimeout(() => {
//       this.message = '';
//     }, 5000);
//   }
// }



// src/app/components/org-admin/employee-management/employee-management.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrgAdminService } from '../../../services/org-admin';
import { Employee, EmployeeFormData, BankAccount } from '../../../models/org-admin.model';

@Component({
  selector: 'app-employee-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="employee-management-container">
      <!-- Header Section -->
      <div class="page-header">
        <div class="header-content">
          <h1>👥 Employee Management</h1>
          <p>Manage your team members and their details</p>
        </div>
        <div class="header-actions">
          <button class="toggle-btn" (click)="showOnlyMyEmployees = !showOnlyMyEmployees; loadEmployees()">
            {{ showOnlyMyEmployees ? '👤 My Employees' : '🏢 All Employees' }}
          </button>
          <button class="add-employee-btn" (click)="showAddForm = !showAddForm">
            ➕ Add New Employee
          </button>
        </div>
      </div>

      <!-- Message Alert -->
      <div *ngIf="message" class="alert" [ngClass]="'alert-' + messageType">
        <span>{{ message }}</span>
        <button class="alert-close" (click)="message = ''">✕</button>
      </div>

      <!-- Add Employee Form -->
      <div *ngIf="showAddForm" class="add-form-card">
        <div class="form-header">
          <h2>➕ Add New Employee</h2>
          <button class="close-form-btn" (click)="showAddForm = false; resetForm()">✕</button>
        </div>
        
        <form (ngSubmit)="addEmployee()" class="employee-form">
          <div class="form-grid">
            <div class="form-group">
              <label>👤 Full Name</label>
              <input 
                type="text" 
                [(ngModel)]="newEmployee.name" 
                name="name"
                placeholder="Enter full name"
                required>
            </div>

            <div class="form-group">
              <label>📧 Email Address</label>
              <input 
                type="email" 
                [(ngModel)]="newEmployee.email" 
                name="email"
                placeholder="employee@company.com"
                required>
            </div>

            <div class="form-group">
              <label>📱 Phone Number</label>
              <input 
                type="tel" 
                [(ngModel)]="newEmployee.phoneNumber" 
                name="phone"
                placeholder="+91 XXXXX XXXXX"
                required>
            </div>

            <div class="form-group">
              <label>💼 Designation</label>
              <input 
                type="text" 
                [(ngModel)]="newEmployee.designation" 
                name="designation"
                placeholder="e.g., Software Engineer"
                required>
            </div>

            <div class="form-group">
              <label>🏢 Department</label>
              <input 
                type="text" 
                [(ngModel)]="newEmployee.department" 
                name="department"
                placeholder="e.g., Engineering"
                required>
            </div>

            <div class="form-group file-upload-group">
              <label>📄 Upload Document</label>
              <div class="file-input-wrapper">
                <input 
                  type="file" 
                  (change)="onFileSelect($event)"
                  accept=".pdf,.doc,.docx"
                  id="fileInput"
                  required>
                <label for="fileInput" class="file-label">
                  <span class="file-icon">📎</span>
                  <span *ngIf="!selectedFile">Choose file...</span>
                  <span *ngIf="selectedFile">{{ selectedFile.name }} ({{ formatFileSize(selectedFile.size) }})</span>
                </label>
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn-cancel" (click)="showAddForm = false; resetForm()">
              Cancel
            </button>
            <button type="submit" class="btn-submit" [disabled]="loading || !selectedFile">
              <span *ngIf="!loading">✅ Add Employee</span>
              <span *ngIf="loading">⏳ Adding...</span>
            </button>
          </div>
        </form>
      </div>

      <!-- Employees Grid -->
      <div class="employees-grid">
        <div *ngFor="let emp of employees" class="employee-card">
          <!-- <div class="card-header">
            <div class="employee-avatar">
              {{ emp.name}}
            </div> -->
            <div class="employee-info">
              <h3>{{ emp.name }}</h3>
              <span class="employee-id">ID: {{ emp.employeeId }}</span>
            </div>
            <span class="status-badge" [ngClass]="'status-' + emp.status?.toLowerCase()">
              {{ getStatusLabel(emp.status) }}
            </span>
          <!-- </div> -->

          <div class="card-body">
            <div class="info-row">
              <span class="info-label">📧 Email</span>
              <span class="info-value">{{ emp.email }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">📱 Phone</span>
              <span class="info-value">{{ emp.phoneNumber }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">💼 Designation</span>
              <span class="info-value">{{ emp.designation }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">🏢 Department</span>
              <span class="info-value">{{ emp.department }}</span>
            </div>
          </div>

          <!-- <div class="card-footer">
            <button 
              class="action-btn btn-account"
              (click)="selectEmployee(emp, 'account')"
              [disabled]="emp.status !== 'APPROVED'">
              🏦 Add Bank Account
            </button>
            <button 
              class="action-btn btn-salary"
              (click)="selectEmployee(emp, 'salary')"
              [disabled]="emp.status !== 'APPROVED'">
              💰 Create Salary
            </button>
          </div> -->

          <div class="card-footer">
  <ng-container *ngIf="emp.status === 'APPROVED'; else waitingApproval">
    <button 
      class="action-btn btn-account"
      (click)="selectEmployee(emp, 'account')">
      🏦 Add Bank Account
    </button>
    <button 
      class="action-btn btn-salary"
      (click)="selectEmployee(emp, 'salary')">
      💰 Create Salary
    </button>
  </ng-container>

  <ng-template #waitingApproval>
    <div class="pending-message">
      🕒 Awaiting <strong>Bank Admin</strong> approval before actions become available.
    </div>
  </ng-template>
</div>

        </div>

        <div *ngIf="employees.length === 0" class="empty-state">
          <div class="empty-icon">👥</div>
          <h3>No employees found</h3>
          <p>Add your first employee to get started</p>
          <button class="btn-add-first" (click)="showAddForm = true">
            ➕ Add Employee
          </button>
        </div>
      </div>

      <!-- Bank Account Modal -->
      <div *ngIf="modalType === 'account'" class="modal-overlay" (click)="closeModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>🏦 Add Bank Account</h2>
            <button class="modal-close" (click)="closeModal()">✕</button>
          </div>

          <div class="modal-body">
            <div *ngIf="message" class="alert" [ngClass]="'alert-' + messageType">
              {{ message }}
            </div>

            <form (ngSubmit)="addBankAccount()" class="modal-form">
              <div class="form-group">
                <label>🏦 Bank Name</label>
                <input 
                  type="text" 
                  [(ngModel)]="bankAccount.bankName" 
                  name="bankName"
                  placeholder="e.g., HDFC Bank"
                  required>
              </div>

              <div class="form-group">
                <label>🏢 Branch</label>
                <input 
                  type="text" 
                  [(ngModel)]="bankAccount.branch" 
                  name="branch"
                  placeholder="e.g., Mumbai Main"
                  required>
              </div>

              <div class="form-group">
                <label>🔢 IFSC Code</label>
                <input 
                  type="text" 
                  [(ngModel)]="bankAccount.ifscCode" 
                  name="ifscCode"
                  placeholder="e.g., HDFC0001234"
                  required>
              </div>

              <div class="form-group">
                <label>💳 Account Number</label>
                <input 
                  type="text" 
                  [(ngModel)]="bankAccount.accountNumber" 
                  name="accountNumber"
                  placeholder="Enter account number"
                  required>
              </div>

              <div class="modal-actions">
                <button type="button" class="btn-cancel" (click)="closeModal()">
                  Cancel
                </button>
                <button type="submit" class="btn-submit" [disabled]="loading">
                  <span *ngIf="!loading">✅ Add Account</span>
                  <span *ngIf="loading">⏳ Adding...</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- Salary Modal -->
      <div *ngIf="modalType === 'salary'" class="modal-overlay" (click)="closeModal()">
        <div class="modal-content" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>💰 Create Salary</h2>
            <button class="modal-close" (click)="closeModal()">✕</button>
          </div>

          <div class="modal-body">
            <div *ngIf="message" class="alert" [ngClass]="'alert-' + messageType">
              {{ message }}
            </div>

            <form (ngSubmit)="createSalary()" class="modal-form">
              <div class="form-group">
                <label>💵 Basic Salary</label>
                <input 
                  type="number" 
                  [(ngModel)]="salary.basicSalary" 
                  name="basicSalary"
                  (input)="calculateNetSalary()"
                  placeholder="Enter basic salary"
                  required>
              </div>

              <div class="form-group">
                <label>🏠 HRA</label>
                <input 
                  type="number" 
                  [(ngModel)]="salary.hra" 
                  name="hra"
                  (input)="calculateNetSalary()"
                  placeholder="Enter HRA">
              </div>

              <div class="form-group">
                <label>➕ Allowances</label>
                <input 
                  type="number" 
                  [(ngModel)]="salary.allowances" 
                  name="allowances"
                  (input)="calculateNetSalary()"
                  placeholder="Enter allowances">
              </div>

              <div class="form-group">
                <label>➖ Deductions</label>
                <input 
                  type="number" 
                  [(ngModel)]="salary.deductions" 
                  name="deductions"
                  (input)="calculateNetSalary()"
                  placeholder="Enter deductions">
              </div>

              <div class="net-salary-display">
                <span>Net Salary:</span>
                <strong>₹{{ salary.netSalary | number:'1.2-2' }}</strong>
              </div>

              <div class="modal-actions">
                <button type="button" class="btn-cancel" (click)="closeModal()">
                  Cancel
                </button>
                <button type="submit" class="btn-submit" [disabled]="loading">
                  <span *ngIf="!loading">✅ Create Salary</span>
                  <span *ngIf="loading">⏳ Creating...</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .employee-management-container {
      padding: 40px;
      background: #f7fafc;
      min-height: 100vh;
    }

    /* Header Section */
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      flex-wrap: wrap;
      gap: 20px;
    }

    .pending-message {
  grid-column: 1 / -1;
  text-align: center;
  font-size: 14px;
  color: #856404;
  background: #fff3cd;
  border: 1px solid #ffeeba;
  border-radius: 8px;
  padding: 10px;
  font-weight: 500;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}


    .header-content h1 {
      margin: 0 0 8px 0;
      color: #2d3748;
      font-size: 32px;
      font-weight: 700;
    }

    .header-content p {
      margin: 0;
      color: #718096;
      font-size: 16px;
    }

    .header-actions {
      display: flex;
      gap: 12px;
    }

    .toggle-btn {
      padding: 12px 24px;
      background: white;
      color: #667eea;
      border: 2px solid #667eea;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      transition: all 0.3s;
    }

    .toggle-btn:hover {
      background: #667eea;
      color: white;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }

    .add-employee-btn {
      padding: 12px 24px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      transition: all 0.3s;
    }

    .add-employee-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    /* Alert Messages */
    .alert {
      padding: 16px 20px;
      border-radius: 8px;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      animation: slideIn 0.3s ease;
    }

    .alert-success {
      background: #c6f6d5;
      color: #22543d;
      border-left: 4px solid #38a169;
    }

    .alert-error {
      background: #fed7d7;
      color: #742a2a;
      border-left: 4px solid #e53e3e;
    }

    .alert-close {
      background: none;
      border: none;
      font-size: 20px;
      cursor: pointer;
      opacity: 0.7;
      transition: opacity 0.2s;
    }

    .alert-close:hover {
      opacity: 1;
    }

    /* Add Form Card */
    .add-form-card {
      background: white;
      border-radius: 16px;
      padding: 30px;
      margin-bottom: 30px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      animation: slideDown 0.3s ease;
    }

    .form-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 2px solid #e2e8f0;
    }

    .form-header h2 {
      margin: 0;
      color: #2d3748;
      font-size: 24px;
    }

    .close-form-btn {
      background: #f7fafc;
      border: none;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 20px;
      color: #718096;
      transition: all 0.2s;
    }

    .close-form-btn:hover {
      background: #e2e8f0;
      color: #2d3748;
    }

    .employee-form {
      width: 100%;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      margin-bottom: 24px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
    }

    .form-group label {
      margin-bottom: 8px;
      color: #2d3748;
      font-weight: 600;
      font-size: 14px;
    }

    .form-group input {
      padding: 12px 16px;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      font-size: 14px;
      transition: all 0.3s;
    }

    .form-group input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    /* File Upload */
    .file-upload-group {
      grid-column: 1 / -1;
    }

    .file-input-wrapper input[type="file"] {
      display: none;
    }

    .file-label {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 20px;
      background: #f7fafc;
      border: 2px dashed #cbd5e0;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.3s;
    }

    .file-label:hover {
      background: #edf2f7;
      border-color: #667eea;
    }

    .file-icon {
      font-size: 24px;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding-top: 16px;
      border-top: 2px solid #e2e8f0;
    }

    .btn-cancel {
      padding: 12px 24px;
      background: white;
      color: #718096;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.2s;
    }

    .btn-cancel:hover {
      background: #f7fafc;
      border-color: #cbd5e0;
    }

    .btn-submit {
      padding: 12px 32px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.2s;
    }

    .btn-submit:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    .btn-submit:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    /* Employees Grid */
    .employees-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
      gap: 24px;
    }

    .employee-card {
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
      transition: all 0.3s;
    }

    .employee-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    }

    .card-header {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 24px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .employee-avatar {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      font-weight: 700;
      border: 3px solid rgba(255, 255, 255, 0.5);
    }

    .employee-info {
      flex: 1;
    }

    .employee-info h3 {
      margin: 0 0 4px 0;
      font-size: 18px;
    }

    .employee-id {
      font-size: 12px;
      opacity: 0.9;
    }

    .status-badge {
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 600;
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
    }

    .status-pending_approval {
      background: rgba(251, 191, 36, 0.2);
    }

    .status-approved {
      background: rgba(52, 211, 153, 0.2);
    }

    .status-active {
      background: rgba(16, 185, 129, 0.2);
    }

    .status-rejected {
      background: rgba(239, 68, 68, 0.2);
    }

    .card-body {
      padding: 24px;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid #e2e8f0;
    }

    .info-row:last-child {
      border-bottom: none;
    }

    .info-label {
      color: #718096;
      font-size: 14px;
      font-weight: 600;
    }

    .info-value {
      color: #2d3748;
      font-size: 14px;
      text-align: right;
    }

    .card-footer {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      padding: 20px 24px;
      background: #f7fafc;
    }

    .action-btn {
      padding: 10px 16px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 600;
      transition: all 0.2s;
    }

    .btn-account {
      background: #667eea;
      color: white;
    }

    .btn-account:hover:not(:disabled) {
      background: #5568d3;
    }

    .btn-salary {
      background: #48bb78;
      color: white;
    }

    .btn-salary:hover:not(:disabled) {
      background: #38a169;
    }

    .action-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* Empty State */
    .empty-state {
      grid-column: 1 / -1;
      text-align: center;
      padding: 80px 20px;
      background: white;
      border-radius: 16px;
    }

    .empty-icon {
      font-size: 80px;
      margin-bottom: 20px;
      opacity: 0.5;
    }

    .empty-state h3 {
      margin: 0 0 8px 0;
      color: #2d3748;
      font-size: 24px;
    }

    .empty-state p {
      margin: 0 0 24px 0;
      color: #718096;
    }

    .btn-add-first {
      padding: 14px 32px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      font-size: 16px;
    }

    /* Modal Styles */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.2s ease;
    }

    .modal-content {
      background: white;
      border-radius: 16px;
      width: 90%;
      max-width: 500px;
      max-height: 90vh;
      overflow-y: auto;
      animation: slideUp 0.3s ease;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 24px 30px;
      border-bottom: 2px solid #e2e8f0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 16px 16px 0 0;
    }

    .modal-header h2 {
      margin: 0;
      font-size: 22px;
    }

    .modal-close {
      background: rgba(255, 255, 255, 0.2);
      border: none;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 20px;
      color: white;
      transition: all 0.2s;
    }

    .modal-close:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    .modal-body {
      padding: 30px;
    }

    .modal-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .net-salary-display {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 8px;
      font-size: 18px;
    }

    .net-salary-display strong {
      font-size: 24px;
    }

    .modal-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 8px;
    }

    /* Animations */
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateX(-20px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .employee-management-container {
        padding: 20px;
      }

      .page-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .header-actions {
        width: 100%;
        flex-direction: column;
      }

      .toggle-btn, .add-employee-btn {
        width: 100%;
      }

      .employees-grid {
        grid-template-columns: 1fr;
      }

      .form-grid {
        grid-template-columns: 1fr;
      }

      .card-footer {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class EmployeeManagementComponent implements OnInit {
  employees: Employee[] = [];
  showAddForm = false;
  showOnlyMyEmployees = true;
  selectedEmployee: Employee | null = null;
  modalType: 'account' | 'salary' | null = null;
  message = '';
  messageType = '';
  loading = false;

  newEmployee: EmployeeFormData = {
    name: '',
    email: '',
    phoneNumber: '',
    designation: '',
    department: ''
  };

  selectedFile: File | null = null;

bankAccount: BankAccount = {
  accountId: 0,               // 🆕 Added to match your model
  bankName: '',
  branch: '',
  ifscCode: '',
  accountNumber: '',
  balance: 0,                 // 🆕 Added to match your model
  status: 'PENDING_APPROVAL'
};


  salary: any = {
    basicSalary: 0,
    hra: 0,
    allowances: 0,
    deductions: 0,
    netSalary: 0
  };

  constructor(private orgAdminService: OrgAdminService) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    const orgAdmin = this.orgAdminService.getCurrentOrgAdmin();
    if (!orgAdmin) return;

    const request = this.showOnlyMyEmployees
      ? this.orgAdminService.getEmployeesByAdmin(orgAdmin.organizationId, orgAdmin.orgAdminId)
      : this.orgAdminService.getAllEmployees(orgAdmin.organizationId);

    request.subscribe({
      next: (data) => {
        this.employees = data;
        console.log('✅ Loaded employees:', data);
      },
      error: (err) => {
        console.error('Error loading employees:', err);
        this.showMessage('Failed to load employees', 'error');
      }
    });
  }

  onFileSelect(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        this.showMessage('File size must be less than 5MB', 'error');
        event.target.value = '';
        return;
      }
      this.selectedFile = file;
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  }

  addEmployee(): void {
    const orgAdmin = this.orgAdminService.getCurrentOrgAdmin();
    if (!orgAdmin || !this.selectedFile) return;

    this.loading = true;
    this.message = '';

    const employeeData: EmployeeFormData = {
      ...this.newEmployee,
      document: this.selectedFile
    };

    this.orgAdminService.addEmployee(orgAdmin.orgAdminId, employeeData).subscribe({
      next: (emp) => {
        this.loading = false;
        this.showMessage('✅ Employee added successfully! Pending Bank Admin approval.', 'success');
        this.resetForm();
        this.loadEmployees();
        this.showAddForm = false;
      },
      error: (err) => {
        this.loading = false;
        this.showMessage(err.error?.message || '❌ Failed to add employee', 'error');
      }
    });
  }

  resetForm(): void {
    this.newEmployee = {
      name: '',
      email: '',
      phoneNumber: '',
      designation: '',
      department: ''
    };
    this.selectedFile = null;
    this.message = '';
  }

  selectEmployee(emp: Employee, type: 'account' | 'salary'): void {
    this.selectedEmployee = emp;
    this.modalType = type;
    this.message = '';
  }

 closeModal(): void {
  this.selectedEmployee = null;
  this.modalType = null;
  this.message = '';
  this.bankAccount = {
    accountId: 0,                // 🆕 Added
    bankName: '',
    branch: '',
    ifscCode: '',
    accountNumber: '',
    balance: 0,                  // 🆕 Added
    status: 'PENDING_APPROVAL'
  };


    this.salary = {
      basicSalary: 0,
      hra: 0,
      allowances: 0,
      deductions: 0,
      netSalary: 0
    };
  }

  addBankAccount(): void {
    const orgAdmin = this.orgAdminService.getCurrentOrgAdmin();
    if (!orgAdmin || !this.selectedEmployee) return;

    this.loading = true;
    this.message = '';

    this.orgAdminService.addEmployeeAccount(
      orgAdmin.orgAdminId,
      this.selectedEmployee.employeeId!,
      this.bankAccount
    ).subscribe({
      next: (acc) => {
        this.loading = false;
        this.showMessage('✅ Bank account added successfully!', 'success');
        setTimeout(() => {
          this.closeModal();
          this.loadEmployees();
        }, 1500);
      },
      error: (err) => {
        this.loading = false;
        this.showMessage(err.error?.message || '❌ Failed to add bank account', 'error');
      }
    });
  }

  createSalary(): void {
    const orgAdmin = this.orgAdminService.getCurrentOrgAdmin();
    if (!orgAdmin || !this.selectedEmployee) return;

    this.loading = true;
    this.message = '';

    this.orgAdminService.createSalary(
      orgAdmin.orgAdminId,
      this.selectedEmployee.employeeId!,
      this.salary
    ).subscribe({
      next: (sal) => {
        this.loading = false;
        this.showMessage('✅ Salary created successfully! Employee is now ACTIVE.', 'success');
        setTimeout(() => {
          this.closeModal();
          this.loadEmployees();
        }, 1500);
      },
      error: (err) => {
        this.loading = false;
        this.showMessage(err.error?.message || '❌ Failed to create salary', 'error');
      }
    });
  }

  calculateNetSalary(): void {
    const basic = this.salary.basicSalary || 0;
    const hra = this.salary.hra || 0;
    const allowances = this.salary.allowances || 0;
    const deductions = this.salary.deductions || 0;
    this.salary.netSalary = basic + hra + allowances - deductions;
  }

  getStatusLabel(status: string | undefined): string {
    const labels: any = {
      'PENDING_APPROVAL': '⏳ Pending',
      'APPROVED': '✅ Approved',
      'ACTIVE': '🟢 Active',
      'REJECTED': '❌ Rejected'
    };
    return labels[status || ''] || status || 'Unknown';
  }

  showMessage(msg: string, type: string): void {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => {
      this.message = '';
    }, 5000);
  }
}