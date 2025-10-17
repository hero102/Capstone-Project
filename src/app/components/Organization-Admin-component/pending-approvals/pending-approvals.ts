// src/app/components/org-admin/pending-approvals/pending-approvals.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrgAdminService } from '../../../services/org-admin';
import { PendingEmployee } from '../../../models/org-admin.model';

@Component({
  selector: 'app-pending-approvals',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>⏳ Pending Approvals</h1>
        <button class="btn-refresh" (click)="loadPendingEmployees()">
          🔄 Refresh
        </button>
      </div>

      <div *ngIf="loading" class="loading">
        Loading pending approvals...
      </div>

      <div *ngIf="!loading && pendingEmployees.length === 0" class="empty-state">
        <div class="empty-icon">✅</div>
        <h2>No Pending Approvals</h2>
        <p>All employee applications have been processed by the Bank Admin.</p>
      </div>

      <div class="employee-grid">
        <div *ngFor="let emp of pendingEmployees" class="employee-card pending">
          <div class="employee-header">
            <h3>{{ emp.name }}</h3>
            <span class="status-badge">⏳ Awaiting Bank Approval</span>
          </div>

          <div class="employee-details">
            <p><strong>📧 Email:</strong> {{ emp.email }}</p>
            <p><strong>📱 Phone:</strong> {{ emp.phoneNumber }}</p>
            <p><strong>💼 Designation:</strong> {{ emp.designation }}</p>
            <p><strong>🏢 Department:</strong> {{ emp.department }}</p>
            
            <p *ngIf="emp.documentUrl">
              <strong>📄 Document:</strong> 
              <a [href]="emp.documentUrl" target="_blank" class="doc-link">View Document</a>
            </p>
          </div>

          <div class="pending-info">
            <p>ℹ️ This employee is currently under review by the Bank Admin. 
            You will be notified once the decision is made.</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: 40px; background: #f7fafc; min-height: 100vh; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
    .page-header h1 { color: #2d3748; margin: 0; font-size: 28px; }
    
    .btn-refresh { padding: 12px 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                    color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; }
    .btn-refresh:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3); }
    
    .loading { text-align: center; padding: 60px; color: #718096; font-size: 18px; }
    
    .empty-state { text-align: center; padding: 80px 20px; }
    .empty-icon { font-size: 80px; margin-bottom: 20px; }
    .empty-state h2 { color: #2d3748; margin: 0 0 12px 0; }
    .empty-state p { color: #718096; }
    
    .employee-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 20px; }
    .employee-card { background: white; border-radius: 12px; padding: 24px; 
                     box-shadow: 0 2px 8px rgba(0,0,0,0.08); transition: transform 0.2s; }
    .employee-card:hover { transform: translateY(-4px); box-shadow: 0 4px 16px rgba(0,0,0,0.12); }
    .employee-card.pending { border-left: 4px solid #f6ad55; }
    
    .employee-header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 16px; }
    .employee-header h3 { margin: 0; color: #2d3748; font-size: 18px; }
    
    .status-badge { padding: 6px 12px; border-radius: 20px; font-size: 11px; font-weight: 700; 
                    text-transform: uppercase; background: #feebc8; color: #c05621; }
    
    .employee-details p { margin: 8px 0; color: #4a5568; font-size: 14px; }
    .doc-link { color: #667eea; text-decoration: none; font-weight: 600; }
    .doc-link:hover { text-decoration: underline; }
    
    .pending-info { margin-top: 16px; padding: 12px; background: #fef5e7; color: #c05621; 
                    border-radius: 6px; font-size: 13px; line-height: 1.6; }
  `]
})
export class PendingApprovalsComponent implements OnInit {
  pendingEmployees: PendingEmployee[] = [];
  loading = false;

  constructor(private orgAdminService: OrgAdminService) {}

  ngOnInit(): void {
    this.loadPendingEmployees();
  }

  loadPendingEmployees(): void {
    const orgAdmin = this.orgAdminService.getCurrentOrgAdmin();
    if (!orgAdmin) return;

    this.loading = true;
    this.orgAdminService.getPendingEmployeesForOrgAdmin(orgAdmin.orgAdminId).subscribe({
      next: (data) => {
        this.pendingEmployees = data;
        this.loading = false;
        console.log('✅ Loaded pending employees:', data);
      },
      error: (err) => {
        console.error('Error loading pending employees:', err);
        this.loading = false;
      }
    });
  }
}