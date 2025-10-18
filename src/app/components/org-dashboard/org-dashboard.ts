// src/app/components/org-admin/org-dashboard/org-dashboard.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { OrgAdminService } from '../../services/org-admin';
import { OrgAdminLoginResponse } from '../../models/org-admin.model';

@Component({
  selector: 'app-org-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './org-dashboard.html',
  styleUrls: ['./org-dashboard.scss']
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

  logout(): void {
    this.orgAdminService.logout();
    this.router.navigate(['/login']);
  }
}
