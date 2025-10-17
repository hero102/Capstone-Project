import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../../services/employee';
import { AuthService } from '../../../services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-salary',
  imports:[CommonModule],
  templateUrl: './salary.html'
})
export class SalaryComponent implements OnInit {
  empId!: number;
  salaries: any[] = [];
  message = '';

  constructor(private empService: EmployeeService, private auth: AuthService) {}

  ngOnInit(): void {
    this.empId = this.auth.getEmployeeId();
    this.loadSalaryHistory();
  }

  loadSalaryHistory() {
    this.empService.getSalaryHistory(this.empId).subscribe({
      next: (res) => (this.salaries = res),
      error: (err) => (this.message = 'Error loading salary history.')
    });
  }

  downloadPayslip(salaryId: number) {
    this.empService.downloadPayslip(this.empId, salaryId).subscribe((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Payslip_${salaryId}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }

  sendPayslipEmail(salaryId: number) {
    this.empService.sendPayslipEmail(this.empId, salaryId).subscribe({
      next: (res) => (this.message = res.message),
      error: () => (this.message = 'Error sending payslip email.')
    });
  }
}
