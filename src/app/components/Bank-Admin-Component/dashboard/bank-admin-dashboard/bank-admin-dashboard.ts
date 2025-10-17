// bank-admin-dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bank-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bank-admin-dashboard.html'
})
export class BankAdminDashboardComponent implements OnInit {
  adminName = '';

  constructor(private router: Router) {}

  ngOnInit() {
    this.adminName = localStorage.getItem('bankAdminName') || 'Admin';
  }

  navigate(path: string) {
    this.router.navigate([`/bank-admin/${path}`]);
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/bank-admin/login']);
  }
}