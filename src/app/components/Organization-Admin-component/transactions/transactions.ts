// src/app/components/org-admin/transactions/transactions.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrgAdminService } from '../../../services/org-admin';
import { Transaction } from '../../../models/org-admin.model';

@Component({
  selector: 'app-transactions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <h1>📜 Transaction History</h1>
        <button class="btn-refresh" (click)="loadTransactions()">
          🔄 Refresh
        </button>
      </div>

      <div class="filters-section">
        <input 
          type="text" 
          [(ngModel)]="searchText" 
          placeholder="🔍 Search by employee, account, or description..."
          class="search-input"
        />
        <select [(ngModel)]="statusFilter" class="filter-select">
          <option value="">All Status</option>
          <option value="SUCCESS">Success</option>
          <option value="PENDING">Pending</option>
          <option value="FAILED">Failed</option>
        </select>
      </div>

      <div *ngIf="transactions.length === 0 && !loading" class="empty-state">
        <div class="empty-icon">📭</div>
        <h3>No Transactions Found</h3>
        <p>Transaction history will appear here once salary disbursements are completed.</p>
      </div>

      <div *ngIf="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading transactions...</p>
      </div>

      <div *ngIf="transactions.length > 0" class="transactions-container">
        <div class="stats-bar">
          <div class="stat">
            <span class="stat-label">Total Transactions:</span>
            <span class="stat-value">{{ filteredTransactions().length }}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Total Amount:</span>
            <span class="stat-value">₹{{ calculateTotalAmount() | number }}</span>
          </div>
        </div>

        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Employee</th>
                <th>From Account</th>
                <th>To Account</th>
                <th>Amount</th>
                <th>Description</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let txn of filteredTransactions()">
                <td>#{{ txn.transactionId }}</td>
                <td>{{ txn.transactionDate | date: 'short' }}</td>
                <td>{{ txn.employeeName }}</td>
                <td>
                  <span class="account-number">{{ txn.debitAccount }}</span>
                </td>
                <td>
                  <span class="account-number">{{ txn.creditAccount }}</span>
                </td>
                <td class="amount">₹{{ txn.amount | number }}</td>
                <td>{{ txn.description }}</td>
                <td>
                  <span [class]="'status-badge ' + txn.status.toLowerCase()">
                    {{ txn.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container { padding: 40px; background: #f7fafc; min-height: 100vh; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
    .page-header h1 { color: #2d3748; margin: 0; font-size: 28px; }
    
    .btn-refresh { padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: 600; }
    .btn-refresh:hover { background: #5a67d8; }
    
    .filters-section { background: white; padding: 20px; border-radius: 12px; margin-bottom: 20px; display: flex; gap: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .search-input { flex: 1; padding: 12px; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 14px; }
    .search-input:focus { outline: none; border-color: #667eea; }
    .filter-select { padding: 12px; border: 2px solid #e2e8f0; border-radius: 8px; font-size: 14px; min-width: 150px; }
    
    .empty-state { background: white; border-radius: 12px; padding: 60px 20px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .empty-icon { font-size: 64px; margin-bottom: 16px; }
    .empty-state h3 { color: #2d3748; margin: 0 0 8px 0; }
    .empty-state p { color: #718096; margin: 0; }
    
    .loading-state { background: white; border-radius: 12px; padding: 60px 20px; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    .spinner { width: 50px; height: 50px; border: 4px solid #e2e8f0; border-top-color: #667eea; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 16px; }
    @keyframes spin { to { transform: rotate(360deg); } }
    
    .transactions-container { background: white; border-radius: 12px; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.08); }
    
    .stats-bar { display: flex; gap: 40px; margin-bottom: 24px; padding-bottom: 24px; border-bottom: 2px solid #e2e8f0; }
    .stat { display: flex; flex-direction: column; gap: 4px; }
    .stat-label { color: #718096; font-size: 13px; }
    .stat-value { color: #2d3748; font-size: 20px; font-weight: 700; }
    
    .table-container { overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; }
    th { background: #f7fafc; padding: 12px; text-align: left; color: #4a5568; font-weight: 600; font-size: 13px; border-bottom: 2px solid #e2e8f0; white-space: nowrap; }
    td { padding: 12px; border-bottom: 1px solid #e2e8f0; font-size: 14px; color: #2d3748; }
    tr:hover { background: #f7fafc; }
    
    .account-number { font-family: monospace; background: #edf2f7; padding: 4px 8px; border-radius: 4px; font-size: 12px; }
    .amount { color: #48bb78; font-weight: 600; white-space: nowrap; }
    
    .status-badge { padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; white-space: nowrap; }
    .status-badge.success { background: #c6f6d5; color: #22543d; }
    .status-badge.pending { background: #feebc8; color: #c05621; }
    .status-badge.failed { background: #fed7d7; color: #c53030; }
  `]
})
export class TransactionsComponent implements OnInit {
  transactions: Transaction[] = [];
  searchText = '';
  statusFilter = '';
  loading = false;

  constructor(private orgAdminService: OrgAdminService) {}

  ngOnInit(): void {
    this.loadTransactions();
  }

  loadTransactions(): void {
    const orgAdmin = this.orgAdminService.getCurrentOrgAdmin();
    if (!orgAdmin) return;

    this.loading = true;
    this.orgAdminService.getAllTransactions(orgAdmin.organizationId).subscribe({
      next: (data) => {
        this.transactions = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Failed to load transactions:', error);
        this.loading = false;
        this.transactions = []; // Set empty array on error
      }
    });
  }

  filteredTransactions(): Transaction[] {
    let filtered = this.transactions;

    // Filter by search text
    if (this.searchText) {
      const search = this.searchText.toLowerCase();
      filtered = filtered.filter(txn =>
        txn.employeeName?.toLowerCase().includes(search) ||
        txn.debitAccount.toLowerCase().includes(search) ||
        txn.creditAccount.toLowerCase().includes(search) ||
        txn.description.toLowerCase().includes(search)
      );
    }

    // Filter by status
    if (this.statusFilter) {
      filtered = filtered.filter(txn => txn.status === this.statusFilter);
    }

    return filtered;
  }

  calculateTotalAmount(): number {
    return this.filteredTransactions().reduce((sum, txn) => sum + txn.amount, 0);
  }
}