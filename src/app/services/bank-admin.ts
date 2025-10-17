// ============================================================
// FILE: src/app/services/bank-admin.service.ts
// CREATE THIS FILE IN YOUR PROJECT
// ============================================================

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ 
  providedIn: 'root' 
})
export class BankAdminService {
  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  // Login
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/bank-admin-login`, { 
      email, 
      password 
    });
  }

  // Get pending organizations
  getPendingOrganizations(bankAdminId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/organizations/pending/${bankAdminId}`
    );
  }

  // Approve organization
  approveOrganization(bankAdminId: number, orgId: number): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/organizations/approve/${bankAdminId}/${orgId}`, 
      {}
    );
  }

  // Reject organization
  rejectOrganization(bankAdminId: number, orgId: number, reason: string): Observable<any> {
    return this.http.put(
      `${this.baseUrl}/organizations/reject/${bankAdminId}/${orgId}`, 
      reason, 
      {
        headers: new HttpHeaders({ 'Content-Type': 'text/plain' })
      }
    );
  }

  // Get pending employees
  getPendingEmployees(bankAdminId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/payroll/bank-admin/${bankAdminId}/pending-employees`
    );
  }

  // Review employee (approve or reject)
  reviewEmployee(bankAdminId: number, empId: number, approve: boolean, reason?: string): Observable<any> {
    const params = reason 
      ? `?approve=${approve}&reason=${encodeURIComponent(reason)}` 
      : `?approve=${approve}`;
    return this.http.post(
      `${this.baseUrl}/payroll/bank-admin/${bankAdminId}/review-employee/${empId}${params}`, 
      {}
    );
  }

  // Approve disbursement request
  approveDisbursement(bankAdminId: number, requestId: number): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/payroll/bank-admin/${bankAdminId}/approve-disbursement/${requestId}`, 
      {}
    );
  }

  // Create bank admin
  createBankAdmin(bankId: number, formData: FormData): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/bank-admins/${bankId}/create`, 
      formData
    );
  }

  // Get pending disbursement requests (if you have this endpoint)
  getPendingDisbursements(bankAdminId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/disbursements/pending/${bankAdminId}`
    );
  }
}


// ============================================================
// USAGE IN COMPONENTS:
// ============================================================
// Import in your component:
// import { BankAdminService } from '../../../services/bank-admin.service';
//
// Inject in constructor:
// constructor(private service: BankAdminService) {}
//
// Use in methods:
// this.service.login(email, password).subscribe({...});
// ============================================================