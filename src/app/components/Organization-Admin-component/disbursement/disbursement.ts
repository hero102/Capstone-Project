// src/app/components/org-admin/disbursement/disbursement.component.ts

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrgAdminService } from '../../../services/org-admin';

@Component({
  selector: 'app-disbursement',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>💸 Salary Disbursement</h1>
      </div>

      <div class="request-section">
        <h2>📤 Request Salary Disbursement</h2>
        <p>Submit a request to disburse salaries for a specific month to the bank</p>

        <form (ngSubmit)="requestDisbursement()" class="request-form">
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

          <button type="submit" [disabled]="!selectedMonth || loading" class="btn-request">
            {{ loading ? '⏳ Submitting...' : '📤 Submit Request' }}
          </button>
        </form>
      </div>

      <div *ngIf="requestResponse" class="response-section">
        <h2>✅ Request Submitted Successfully</h2>
        <div class="response-card">
          <div class="response-item">
            <span class="label">Request ID:</span>
            <span class="value">#{{ requestResponse.requestId }}</span>
          </div>
          <div class="response-item">
            <span class="label">Organization:</span>
            <span class="value">{{ requestResponse.organizationName }}</span>
          </div>
          <div class="response-item">
            <span class="label">Month:</span>
            <span class="value">{{ requestResponse.month }}</span>
          </div>
          <div class="response-item">
            <span class="label">Total Amount:</span>
            <span class="value amount">₹{{ requestResponse.totalAmount | number }}</span>
          </div>
          <div class="response-item">
            <span class="label">Status:</span>
            <span [class]="'status-badge ' + requestResponse.status.toLowerCase()">
              {{ requestResponse.status }}
            </span>
          </div>
          <div class="response-item">
            <span class="label">Requested At:</span>
            <span class="value">{{ requestResponse.requestedAt | date: 'medium' }}</span>
          </div>
        </div>

        <div class="info-box">
          <p>🔔 Your request has been sent to the Bank Admin for approval.</p>
          <p>💡 You will receive an email notification once the disbursement is completed.</p>
        </div>
      </div>

      <div class="info-card">
        <h3>📋 Disbursement Process</h3>
        <div class="process-steps">
          <div class="step">
            <div class="step-number">1</div>
            <div class="step-content">
              <h4>Generate Salaries</h4>
              <p>Generate monthly salaries for all active employees</p>
            </div>
          </div>
          <div class="step">
            <div class="step-number">2</div>
            <div class="step-content">
              <h4>Request Disbursement</h4>
              <p>Submit disbursement request to Bank Admin</p>
            </div>
          </div>
          <div class="step">
            <div class="step-number">3</div>
            <div class="step-content">
              <h4>Bank Approval</h4>
              <p>Bank Admin reviews and approves the request</p>
            </div>
          </div>
          <div class="step">
            <div class="step-number">4</div>
            <div class="step-content">
              <h4>Auto Disbursement</h4>
              <p>System automatically transfers salaries to employee accounts</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: 40px; background: #f7fafc; min-height: 100vh; }
    .page-header h1 { color: #2d3748; margin: 0 0 30px 0; font-size: 28px; }
    
    .request-section { background: white; border-radius: 12px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); margin-bottom: 30px; }
    .request-section h2 { color: #2d3748; margin: 0 0 8px 0; font-size: 22px; }
    .request-section p { color: #718096; margin: 0 0 24px 0; }
    
    .request-form { max-width: 500px; }
    .form-group { margin-bottom: 20px; }
    .form-group label { display: block; color: #4a5568; font-weight: 600; margin-bottom: 8px; }
    .form-group input { width: 100%; padding: 12px; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 14px; box-sizing: border-box; }
    .form-group input:focus { outline: none; border-color: #667eea; }
    
    .message { padding: 12px; border-radius: 8px; margin-bottom: 20px; }
    .message.success { background: #c6f6d5; color: #22543d; }
    .message.error { background: #fed7d7; color: #c53030; }
    
    .btn-request { padding: 14px 28px; background: linear-gradient(135deg, #48bb78 0%, #38a169 100%); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 16px; width: 100%; }
    .btn-request:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(72, 187, 120, 0.3); }
    .btn-request:disabled { opacity: 0.6; cursor: not-allowed; }
    
    .response-section { background: white; border-radius: 12px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); margin-bottom: 30px; }
    .response-section h2 { color: #2d3748; margin: 0 0 24px 0; font-size: 20px; }
    
    .response-card { background: #f7fafc; border-radius: 8px; padding: 24px; margin-bottom: 20px; }
    .response-item { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #e2e8f0; }
    .response-item:last-child { border-bottom: none; }
    .response-item .label { color: #718096; font-weight: 600; }
    .response-item .value { color: #2d3748; font-weight: 500; }
    .response-item .amount { color: #48bb78; font-size: 18px; font-weight: 700; }
    
    .status-badge { padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; }
    .status-badge.pending { background: #feebc8; color: #c05621; }
    .status-badge.completed { background: #c6f6d5; color: #22543d; }
    
    .info-box { background: #e6fffa; border-left: 4px solid #38b2ac; padding: 16px; border-radius: 8px; }
    .info-box p { margin: 8px 0; color: #234e52; }
    
    .info-card { background: white; border-radius: 12px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .info-card h3 { color: #2d3748; margin: 0 0 24px 0; }
    
    .process-steps { display: grid; gap: 20px; }
    .step { display: flex; gap: 16px; align-items: start; }
    .step-number { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700; flex-shrink: 0; }
    .step-content h4 { margin: 0 0 4px 0; color: #2d3748; }
    .step-content p { margin: 0; color: #718096; font-size: 14px; }
  `]
})
export class DisbursementComponent {
  selectedMonth = '';
  maxMonth = '';
  requestResponse: any = null;
  message = '';
  messageType = '';
  loading = false;

  constructor(private orgAdminService: OrgAdminService) {
    const today = new Date();
    this.maxMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
  }

  requestDisbursement(): void {
    const orgAdmin = this.orgAdminService.getCurrentOrgAdmin();
    if (!orgAdmin) return;

    // Convert "2025-10" to "2025-10-01"
    const monthDate = `${this.selectedMonth}-01`;

    this.loading = true;
    this.message = '';
    this.requestResponse = null;

    this.orgAdminService.requestDisbursement(orgAdmin.orgAdminId, monthDate).subscribe({
      next: (response) => {
        this.loading = false;
        this.requestResponse = response;
        this.showMessage('✅ Disbursement request submitted successfully!', 'success');
      },
      error: (error) => {
        this.loading = false;
        this.showMessage(error.error?.message || '❌ Failed to submit disbursement request', 'error');
      }
    });
  }

  showMessage(msg: string, type: string): void {
    this.message = msg;
    this.messageType = type;
  }
}