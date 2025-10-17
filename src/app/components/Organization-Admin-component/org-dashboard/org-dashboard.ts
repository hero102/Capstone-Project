// src/app/components/org-admin/org-dashboard/org-dashboard.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { OrgAdminService } from '../../../services/org-admin';
import { OrgAdminLoginResponse } from '../../../models/org-admin.model';

@Component({
  selector: 'app-org-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-container">
      <nav class="sidebar">
        <div class="sidebar-header">
          <h2>🏢 {{ orgAdmin?.organizationName }}</h2>
          <p>{{ orgAdmin?.email }}</p>
        </div>

        <ul class="nav-menu">
          <li>
            <a routerLink="/org-admin/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">
              <span>📊</span> Dashboard
            </a>
          </li>
          <li>
            <a routerLink="/org-admin/employees" routerLinkActive="active">
              <span>👥</span> Employee Management
            </a>
          </li>
          <li>
            <a routerLink="/org-admin/salary" routerLinkActive="active">
              <span>💰</span> Salary Management
            </a>
          </li>
          <li>
            <a routerLink="/org-admin/disbursement" routerLinkActive="active">
              <span>💸</span> Disbursement
            </a>
          </li>
          <li>
            <a routerLink="/org-admin/transactions" routerLinkActive="active">
              <span>📜</span> Transactions
            </a>
          </li>
        </ul>

        <button class="logout-btn" (click)="logout()">
          🚪 Logout
        </button>
      </nav>

      <main class="main-content">
        <div class="welcome-section">
          <h1>Welcome back! 👋</h1>
          <p>Manage your organization's payroll efficiently</p>

          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon">👥</div>
              <div class="stat-info">
                <h3>{{ stats.totalEmployees }}</h3>
                <p>Total Employees</p>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon">✅</div>
              <div class="stat-info">
                <h3>{{ stats.activeEmployees }}</h3>
                <p>Active Employees</p>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon">💰</div>
              <div class="stat-info">
                <h3>₹{{ stats.monthlySalary | number }}</h3>
                <p>Monthly Payroll</p>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon">📅</div>
              <div class="stat-info">
                <h3>{{ currentMonth }}</h3>
                <p>Current Month</p>
              </div>
            </div>
          </div>

          <div class="quick-actions">
            <h2>Quick Actions</h2>
            <div class="action-buttons">
              <button class="action-btn" routerLink="/org-admin/employees/add">
                ➕ Add Employee
              </button>
              <button class="action-btn" routerLink="/org-admin/salary/generate">
                🧮 Generate Salaries
              </button>
              <button class="action-btn" routerLink="/org-admin/disbursement">
                💸 Request Disbursement
              </button>
              <button class="action-btn" routerLink="/org-admin/employees">
                👥 View Employees
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .dashboard-container {
      display: flex;
      min-height: 100vh;
      background: #f7fafc;
    }

    .sidebar {
      width: 280px;
      background: linear-gradient(180deg, #2d3748 0%, #1a202c 100%);
      color: white;
      display: flex;
      flex-direction: column;
      position: fixed;
      height: 100vh;
      overflow-y: auto;
    }

    .sidebar-header {
      padding: 30px 20px;
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }

    .sidebar-header h2 {
      margin: 0 0 8px 0;
      font-size: 18px;
    }

    .sidebar-header p {
      margin: 0;
      font-size: 12px;
      opacity: 0.7;
    }

    .nav-menu {
      list-style: none;
      padding: 20px 0;
      margin: 0;
      flex: 1;
    }

    .nav-menu li {
      margin-bottom: 4px;
    }

    .nav-menu a {
      display: flex;
      align-items: center;
      padding: 14px 20px;
      color: rgba(255,255,255,0.8);
      text-decoration: none;
      transition: all 0.3s;
    }

    .nav-menu a span {
      font-size: 20px;
      margin-right: 12px;
    }

    .nav-menu a:hover, .nav-menu a.active {
      background: rgba(255,255,255,0.1);
      color: white;
    }

    .logout-btn {
      margin: 20px;
      padding: 12px;
      background: #e53e3e;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
    }

    .logout-btn:hover {
      background: #c53030;
    }

    .main-content {
      margin-left: 280px;
      flex: 1;
      padding: 40px;
    }

    .welcome-section h1 {
      color: #2d3748;
      margin: 0 0 8px 0;
      font-size: 32px;
    }

    .welcome-section > p {
      color: #718096;
      margin: 0 0 30px 0;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 20px;
      margin-bottom: 40px;
    }

    .stat-card {
      background: white;
      padding: 24px;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .stat-icon {
      font-size: 36px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 12px;
    }

    .stat-info h3 {
      margin: 0 0 4px 0;
      color: #2d3748;
      font-size: 24px;
    }

    .stat-info p {
      margin: 0;
      color: #718096;
      font-size: 13px;
    }

    .quick-actions {
      background: white;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }

    .quick-actions h2 {
      margin: 0 0 20px 0;
      color: #2d3748;
      font-size: 20px;
    }

    .action-buttons {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
    }

    .action-btn {
      padding: 16px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      transition: transform 0.2s;
    }

    .action-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
    }
  `]
})
export class OrgDashboardComponent implements OnInit {
  orgAdmin: OrgAdminLoginResponse | null = null;
  currentMonth: string = '';
  stats = {
    totalEmployees: 0,
    activeEmployees: 0,
    monthlySalary: 0
  };

  constructor(
    private orgAdminService: OrgAdminService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.orgAdmin = this.orgAdminService.getCurrentOrgAdmin();
    this.currentMonth = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    this.loadStats();
  }


loadStats(): void {
  if (this.orgAdmin) {
    this.orgAdminService.getEmployeesByAdmin(
      this.orgAdmin.organizationId,
      this.orgAdmin.orgAdminId
    ).subscribe({
      next: (employees) => {
        console.log('✅ My Assigned Employees:', employees);
        this.stats.totalEmployees = employees.length;
        this.stats.activeEmployees = employees.filter(e => e.status === 'ACTIVE').length;
      },
      error: (err) => console.error('Error fetching employees by admin:', err)
    });
  }
}

//   loadStats(): void {
//   if (this.orgAdmin) {
//     this.orgAdminService.getAllEmployees(this.orgAdmin.organizationId).subscribe({
//       next: (employees) => {
//         console.log('✅ Employees returned:', employees);
//         this.stats.totalEmployees = employees.length;
//         this.stats.activeEmployees = employees.filter(e => e.status === 'ACTIVE').length;
//       },
//       error: (err) => console.error('Error fetching employees:', err)
//     });
//   }
// }


  logout(): void {
    this.orgAdminService.logout();
    this.router.navigate(['/org-admin/login']);
  }
}