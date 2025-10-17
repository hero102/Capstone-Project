import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-organizations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './organizations.html'
})
export class OrganizationsComponent implements OnInit {
  organizations: any[] = [];
  loading = false;
  rejectingOrg: any = null;
  rejectReason = '';
  message = '';
  success = false;
  bankAdminId!: number;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.bankAdminId = Number(localStorage.getItem('bankAdminId'));
    this.loadOrganizations();
  }

  loadOrganizations() {
    this.loading = true;
    this.http.get<any[]>(`http://localhost:8080/api/organizations/pending/${this.bankAdminId}`)
      .subscribe({
        next: (data) => {
          this.organizations = data;
          this.loading = false;
        },
        error: () => { this.loading = false; }
      });
  }

  approve(orgId: number) {
    this.http.put(`http://localhost:8080/api/organizations/approve/${this.bankAdminId}/${orgId}`, {})
      .subscribe({
        next: () => {
          this.showMessage('✅ Organization approved successfully! Corporate account created.', true);
          this.loadOrganizations();
        },
        error: (err) => {
          this.showMessage('❌ ' + (err.error?.message || 'Approval failed'), false);
        }
      });
  }

  openReject(org: any) {
    this.rejectingOrg = org;
    this.rejectReason = '';
  }

  confirmReject(orgId: number) {
    if (!this.rejectReason.trim()) {
      alert('Please enter rejection reason');
      return;
    }
    this.http.put(`http://localhost:8080/api/organizations/reject/${this.bankAdminId}/${orgId}`, 
      this.rejectReason, { headers: { 'Content-Type': 'text/plain' } })
      .subscribe({
        next: () => {
          this.showMessage('✅ Organization rejected', true);
          this.rejectingOrg = null;
          this.loadOrganizations();
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