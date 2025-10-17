import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-disbursements',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="padding: 20px; max-width: 1200px; margin: 0 auto;">
      <h2 style="margin-bottom: 30px; color: #333;">💰 Pending Salary Disbursements</h2>

      <div *ngIf="loading" style="text-align: center; padding: 60px; color: #666; font-size: 18px;">
        Loading disbursement requests...
      </div>

      <div *ngIf="!loading && requests.length === 0" 
        style="text-align: center; padding: 60px; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        <div style="font-size: 48px; margin-bottom: 15px;">✅</div>
        <p style="color: #666; font-size: 18px; margin: 0;">No pending disbursement requests</p>
      </div>

      <div *ngFor="let req of requests" 
        style="margin-bottom: 25px; padding: 25px; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
        
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px;">
          <h3 style="margin: 0; color: #333; font-size: 20px;">{{ req.organizationName }}</h3>
          <span style="padding: 5px 15px; background: #17a2b8; color: white; border-radius: 20px; font-size: 12px; font-weight: 600;">
            {{ req.status }}
          </span>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px;">
          <div>
            <strong style="color: #666;">Month:</strong>
            <p style="margin: 5px 0 0 0;">{{ req.month }}</p>
          </div>
          <div>
            <strong style="color: #666;">Total Amount:</strong>
            <p style="margin: 5px 0 0 0; color: #28a745; font-weight: 600; font-size: 18px;">₹{{ req.totalAmount | number:'1.2-2' }}</p>
          </div>
          <div>
            <strong style="color: #666;">Requested At:</strong>
            <p style="margin: 5px 0 0 0;">{{ req.requestedAt | date:'medium' }}</p>
          </div>
        </div>
        
        <button (click)="approve(req.requestId)" [disabled]="processing"
          [style.opacity]="processing ? '0.6' : '1'"
          style="margin-top: 15px; padding: 12px 30px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 500; font-size: 15px;">
          {{ processing ? 'Processing...' : '✅ Approve & Disburse' }}
        </button>
      </div>

      <div *ngIf="message" 
        [style.background]="success ? '#d4edda' : '#f8d7da'" 
        [style.color]="success ? '#155724' : '#721c24'"
        style="position: fixed; top: 20px; right: 20px; padding: 15px 25px; border-radius: 4px; box-shadow: 0 2px 10px rgba(0,0,0,0.2); font-weight: 500; z-index: 1000;">
        {{ message }}
      </div>
    </div>
  `
})
export class DisbursementsComponent implements OnInit {
  requests: any[] = [];
  loading = false;
  processing = false;
  message = '';
  success = false;
  bankAdminId!: number;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.bankAdminId = Number(localStorage.getItem('bankAdminId'));
    this.loadRequests();
  }

  loadRequests() {
    this.loading = true;
    // Note: You may need to create this endpoint or adjust based on your backend
    this.http.get<any[]>(`http://localhost:8080/api/disbursements/pending/${this.bankAdminId}`)
      .subscribe({
        next: (data) => {
          this.requests = data;
          this.loading = false;
        },
        error: () => { 
          this.requests = []; // If endpoint doesn't exist yet
          this.loading = false; 
        }
      });
  }

  approve(requestId: number) {
    this.processing = true;
    this.http.post(`http://localhost:8080/api/payroll/bank-admin/${this.bankAdminId}/approve-disbursement/${requestId}`, {})
      .subscribe({
        next: () => {
          this.showMessage('✅ Disbursement completed successfully! Salaries credited to employees.', true);
          this.processing = false;
          this.loadRequests();
        },
        error: (err) => {
          this.showMessage('❌ ' + (err.error?.message || 'Disbursement failed'), false);
          this.processing = false;
        }
      });
  }

  showMessage(msg: string, isSuccess: boolean) {
    this.message = msg;
    this.success = isSuccess;
    setTimeout(() => this.message = '', 5000);
  }
}
