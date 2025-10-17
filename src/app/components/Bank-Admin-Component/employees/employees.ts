// employees.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employees.html'
})
export class EmployeesComponent implements OnInit {
  employees: any[] = [];
  loading = false;
  rejectingEmp: any = null;
  rejectReason = '';
  message = '';
  success = false;
  bankAdminId!: number;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.bankAdminId = Number(localStorage.getItem('bankAdminId'));
    this.loadEmployees();
  }

  loadEmployees() {
    this.loading = true;
    this.http.get<any[]>(`http://localhost:8080/api/payroll/bank-admin/${this.bankAdminId}/pending-employees`)
      .subscribe({
        next: (data) => {
          this.employees = data;
          this.loading = false;
        },
        error: () => { this.loading = false; }
      });
  }

  approve(empId: number) {
    this.http.post(`http://localhost:8080/api/payroll/bank-admin/${this.bankAdminId}/review-employee/${empId}?approve=true`, {})
      .subscribe({
        next: () => {
          this.showMessage('✅ Employee approved successfully!', true);
          this.loadEmployees();
        },
        error: (err) => {
          this.showMessage('❌ ' + (err.error?.message || 'Approval failed'), false);
        }
      });
  }

  openReject(emp: any) {
    this.rejectingEmp = emp;
    this.rejectReason = '';
  }

  confirmReject(empId: number) {
    if (!this.rejectReason.trim()) {
      alert('Please enter rejection reason');
      return;
    }
    this.http.post(`http://localhost:8080/api/payroll/bank-admin/${this.bankAdminId}/review-employee/${empId}?approve=false&reason=${encodeURIComponent(this.rejectReason)}`, {})
      .subscribe({
        next: () => {
          this.showMessage('✅ Employee rejected', true);
          this.rejectingEmp = null;
          this.loadEmployees();
        },
        error: (err) => {
          this.showMessage('❌ ' + (err.error?.message || 'Rejection failed'), false);
        }
      });
  }

  showMessage(msg: string, isSuccess: boolean) {
    this.message = msg;
    this.success = isSuccess;
    setTimeout(() => this.message = '', 4000);
  }
}
