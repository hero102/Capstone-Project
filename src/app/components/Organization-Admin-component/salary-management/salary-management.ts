// src/app/components/org-admin/salary-management/salary-management.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrgAdminService } from '../../../services/org-admin';
import { SalarySummary } from '../../../models/org-admin.model';

@Component({
  selector: 'app-salary-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>💰 Salary Management</h1>
      </div>

      <div class="generate-section">
        <h2>🧮 Generate Monthly Salaries</h2>
        <p>Generate salaries for all active employees for a specific month</p>

        <form (ngSubmit)="generateSalaries()" class="generate-form">
          <div class="form-group">
            <label>Select Month *</label>
            <input 
              type="month" 
              [(ngModel)]="selectedMonth" 
              name="month" 
              required 
              [max]="maxMonth"
            />
          </div>

          <div *ngIf="message" [class]="'message ' + messageType">
            {{ message }}
          </div>

          <button type="submit" [disabled]="!selectedMonth || loading" class="btn-generate">
            {{ loading ? '⏳ Generating...' : '🚀 Generate Salaries' }}
          </button>
        </form>
      </div>

      <div *ngIf="generatedSalaries.length > 0" class="results-section">
        <h2>✅ Generated Salaries ({{ generatedSalaries.length }})</h2>
        <div class="summary-grid">
          <div *ngFor="let salary of generatedSalaries" class="salary-card">
            <div class="employee-info">
              <h3>{{ salary.employeeName }}</h3>
              <p>{{ salary.salaryMonth | date: 'MMMM yyyy' }}</p>
            </div>
            <div class="salary-amount">
              <span class="amount">₹{{ salary.netSalary | number }}</span>
              <span class="label">Net Salary</span>
            </div>
          </div>
        </div>

        <div class="total-summary">
          <h3>Total Payroll: ₹{{ calculateTotal() | number }}</h3>
        </div>
      </div>

      <div class="info-card">
        <h3>ℹ️ How It Works</h3>
        <ul>
          <li>✅ Salaries are generated based on the last salary structure for each employee</li>
          <li>✅ Only active employees with approved bank accounts are included</li>
          <li>✅ Duplicate salaries for the same month are automatically prevented</li>
          <li>✅ Once generated, salaries can be disbursed from the Disbursement section</li>
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: 40px; background: #f7fafc; min-height: 100vh; }
    .page-header h1 { color: #2d3748; margin: 0 0 30px 0; font-size: 28px; }
    
    .generate-section { background: white; border-radius: 12px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); margin-bottom: 30px; }
    .generate-section h2 { color: #2d3748; margin: 0 0 8px 0; font-size: 22px; }
    .generate-section p { color: #718096; margin: 0 0 24px 0; }
    
    .generate-form { max-width: 500px; }
    .form-group { margin-bottom: 20px; }
    .form-group label { display: block; color: #4a5568; font-weight: 600; margin-bottom: 8px; }
    .form-group input { width: 100%; padding: 12px; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 14px; box-sizing: border-box; }
    .form-group input:focus { outline: none; border-color: #667eea; }
    
    .message { padding: 12px; border-radius: 8px; margin-bottom: 20px; }
    .message.success { background: #c6f6d5; color: #22543d; }
    .message.error { background: #fed7d7; color: #c53030; }
    
    .btn-generate { padding: 14px 28px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 16px; width: 100%; }
    .btn-generate:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3); }
    .btn-generate:disabled { opacity: 0.6; cursor: not-allowed; }
    
    .results-section { background: white; border-radius: 12px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); margin-bottom: 30px; }
    .results-section h2 { color: #2d3748; margin: 0 0 24px 0; font-size: 20px; }
    
    .summary-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; margin-bottom: 30px; }
    
    .salary-card { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 24px; border-radius: 12px; color: white; display: flex; justify-content: space-between; align-items: center; }
    .employee-info h3 { margin: 0 0 4px 0; font-size: 18px; }
    .employee-info p { margin: 0; opacity: 0.9; font-size: 14px; }
    .salary-amount { text-align: right; }
    .salary-amount .amount { display: block; font-size: 24px; font-weight: 700; margin-bottom: 4px; }
    .salary-amount .label { font-size: 12px; opacity: 0.9; }
    
    .total-summary { background: #f7fafc; padding: 20px; border-radius: 8px; text-align: center; }
    .total-summary h3 { margin: 0; color: #2d3748; font-size: 24px; }
    
    .info-card { background: #edf2f7; border-radius: 12px; padding: 24px; border-left: 4px solid #4299e1; }
    .info-card h3 { color: #2d3748; margin: 0 0 16px 0; }
    .info-card ul { margin: 0; padding-left: 20px; color: #4a5568; line-height: 1.8; }
  `]
})
export class SalaryManagementComponent {
  selectedMonth = '';
  maxMonth = '';
  generatedSalaries: SalarySummary[] = [];
  message = '';
  messageType = '';
  loading = false;

  constructor(private orgAdminService: OrgAdminService) {
    const today = new Date();
    this.maxMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  }

  generateSalaries(): void {
    const orgAdmin = this.orgAdminService.getCurrentOrgAdmin();
    if (!orgAdmin) return;

    // Convert "2025-10" to "2025-10-01"
    const monthDate = `${this.selectedMonth}-01`;

    this.loading = true;
    this.message = '';

    this.orgAdminService.generateMonthlySalaries(orgAdmin.orgAdminId, monthDate).subscribe({
      next: (response) => {
        this.loading = false;
        this.generatedSalaries = response;
        this.showMessage(`✅ Successfully generated ${response.length} salaries!`, 'success');
      },
      error: (error) => {
        this.loading = false;
        this.showMessage(error.error?.message || '❌ Failed to generate salaries', 'error');
      }
    });
  }

  calculateTotal(): number {
    return this.generatedSalaries.reduce((sum, s) => sum + s.netSalary, 0);
  }

  showMessage(msg: string, type: string): void {
    this.message = msg;
    this.messageType = type;
  }
}