// src/app/services/org-admin.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  OrgAdminLoginRequest,
  OrgAdminLoginResponse,
  Employee,
  BankAccount,
  Salary,
  SalarySummary,
  DisbursementRequest,
  Transaction,
  PendingEmployee,
  EmployeeFormData
} from '../models/org-admin.model';

@Injectable({
  providedIn: 'root'
})
export class OrgAdminService {
  private apiUrl = 'http://localhost:8080/api';
  private currentOrgAdminSubject = new BehaviorSubject<OrgAdminLoginResponse | null>(null);
  public currentOrgAdmin$ = this.currentOrgAdminSubject.asObservable();

  constructor(private http: HttpClient) {
    const stored = localStorage.getItem('orgAdmin');
    if (stored) {
      this.currentOrgAdminSubject.next(JSON.parse(stored));
    }
  }

  // ============ AUTHENTICATION ============
  login(credentials: OrgAdminLoginRequest): Observable<OrgAdminLoginResponse> {
    return this.http.post<OrgAdminLoginResponse>(`${this.apiUrl}/auth/org-admin-login`, credentials)
      .pipe(
        tap(response => {
          localStorage.setItem('orgAdmin', JSON.stringify(response));
          this.currentOrgAdminSubject.next(response);
        })
      );
  }

  logout(): void {
    localStorage.removeItem('orgAdmin');
    this.currentOrgAdminSubject.next(null);
  }

  getCurrentOrgAdmin(): OrgAdminLoginResponse | null {
    return this.currentOrgAdminSubject.value;
  }

  isLoggedIn(): boolean {
    return !!this.currentOrgAdminSubject.value;
  }

  // ============ EMPLOYEE MANAGEMENT ============
  
  /**
   * Add Employee with Document Upload
   * Uses FormData to support file upload
   */
  addEmployee(orgAdminId: number, employeeData: any): Observable<any> {
  const formData = new FormData();

  // Append JSON as "data"
  formData.append('data', new Blob([JSON.stringify({
    name: employeeData.name,
    email: employeeData.email,
    phoneNumber: employeeData.phoneNumber,
    designation: employeeData.designation,
    department: employeeData.department
  })], { type: 'application/json' }));

  // Append file as "document"
  if (employeeData.document) {
    formData.append('document', employeeData.document);
  }

  return this.http.post(`${this.apiUrl}/payroll/${orgAdminId}/add-employee`, formData);
}


  /**
   * Get all employees for the organization
   */
  getAllEmployees(orgId: number): Observable<Employee[]> {
    return this.http.get<Employee[]>(
      `${this.apiUrl}/payroll/organization/${orgId}/employees`
    );
  }

  /**
   * Get employees added by specific org admin (filtered view)
   */
  getEmployeesByAdmin(orgId: number, orgAdminId: number): Observable<Employee[]> {
    return this.http.get<Employee[]>(
      `${this.apiUrl}/payroll/organization/${orgId}/admin/${orgAdminId}/employees`
    );
  }

  /**
   * Get pending employees for organization admin
   */
  getPendingEmployeesForOrgAdmin(orgAdminId: number): Observable<PendingEmployee[]> {
    return this.http.get<PendingEmployee[]>(
      `${this.apiUrl}/payroll/${orgAdminId}/pending-employees`
    );
  }

  // ============ BANK ACCOUNT MANAGEMENT ============
  
  addEmployeeAccount(orgAdminId: number, empId: number, account: BankAccount): Observable<BankAccount> {
    return this.http.post<BankAccount>(
      `${this.apiUrl}/payroll/${orgAdminId}/employee/${empId}/add-account`,
      account
    );
  }

  // ============ SALARY MANAGEMENT ============
  
  /**
   * Create individual salary for an employee
   */
  createSalary(orgAdminId: number, empId: number, salary: Salary): Observable<Salary> {
    return this.http.post<Salary>(
      `${this.apiUrl}/payroll/${orgAdminId}/employee/${empId}/create-salary`,
      salary
    );
  }

  /**
   * Generate monthly salaries for all active employees
   * Automatically uses last salary as template
   */
  generateMonthlySalaries(orgAdminId: number, month: string): Observable<SalarySummary[]> {
    return this.http.post<SalarySummary[]>(
      `${this.apiUrl}/payroll/${orgAdminId}/generate-salaries?month=${month}`,
      {}
    );
  }

  // ============ DISBURSEMENT ============
  
  requestDisbursement(orgAdminId: number, month: string): Observable<DisbursementRequest> {
    return this.http.post<DisbursementRequest>(
      `${this.apiUrl}/payroll/${orgAdminId}/request-disbursement?month=${month}`,
      {}
    );
  }

  // ============ TRANSACTIONS ============
  
  getAllTransactions(orgId: number): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(
      `${this.apiUrl}/payroll/organization/${orgId}/transactions`
    );
  }

  // ============ HELPER METHODS ============
  
  /**
   * Get document URL (already complete from Cloudinary)
   */
  getDocumentUrl(documentUrl: string): string {
    return documentUrl;
  }
}