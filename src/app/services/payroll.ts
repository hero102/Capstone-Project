import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PayrollService {
  private baseUrl = 'http://localhost:8080/api/payroll';

  constructor(private http: HttpClient) {}

  // Get Org Admin ID from localStorage
  getOrgAdminId(): number {
    const id = localStorage.getItem('orgAdminId');
    return id ? parseInt(id, 10) : 0;
  }

  // Get Organization ID from localStorage (if stored)
  getOrganizationId(): number {
    const id = localStorage.getItem('organizationId');
    return id ? parseInt(id, 10) : 0;
  }

  // 1. Add Employee
  addEmployee(orgAdminId: number, employeeData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/${orgAdminId}/add-employee`, employeeData);
  }

  // 2. Get all employees for organization
  getEmployees(orgId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/organization/${orgId}/employees`);
  }

  // 3. Add Employee Bank Account
  addEmployeeBankAccount(orgAdminId: number, employeeId: number, accountData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/${orgAdminId}/employee/${employeeId}/add-account`, accountData);
  }

  // 4. Create Individual Salary
  createSalary(orgAdminId: number, employeeId: number, salaryData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/${orgAdminId}/employee/${employeeId}/create-salary`, salaryData);
  }

  // 5. Create Salary Structure
  createSalaryStructure(orgAdminId: number, employeeId: number, structureData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/${orgAdminId}/employee/${employeeId}/salary-structure`, structureData);
  }

  // 6. Generate Monthly Salaries
  generateMonthlySalaries(orgAdminId: number, month: string): Observable<any[]> {
    const params = new HttpParams().set('month', month);
    return this.http.post<any[]>(`${this.baseUrl}/${orgAdminId}/generate-salaries`, null, { params });
  }

  // 7. Request Salary Disbursement
  requestDisbursement(orgAdminId: number, month: string): Observable<any> {
    const params = new HttpParams().set('month', month);
    return this.http.post(`${this.baseUrl}/${orgAdminId}/request-disbursement`, null, { params });
  }

  // 8. View Transactions
  getTransactions(orgId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/organization/${orgId}/transactions`);
  }

  // 9. Disburse individual salary
  disburseSalary(orgAdminId: number, salaryId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/${orgAdminId}/disburse/${salaryId}`, null);
  }
}