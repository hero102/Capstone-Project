import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private baseUrl = 'http://localhost:8080/api/employees';

  constructor(private http: HttpClient) {}

  // 📊 Dashboard
  getDashboard(empId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${empId}/dashboard`);
  }

  // 👤 Profile
  getProfile(empId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${empId}/profile`);
  }

  // 🖼️ Upload profile photo
  uploadPhoto(empId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('photo', file);
    return this.http.post(`${this.baseUrl}/${empId}/photo`, formData);
  }

  // 💰 Salary history
  getSalaryHistory(empId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${empId}/salary-history`);
  }

  // 📄 Download payslip (PDF)
  downloadPayslip(empId: number, salaryId: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${empId}/payslip/${salaryId}`, {
      responseType: 'blob'
    });
  }

  // 📧 Send payslip email
  sendPayslipEmail(empId: number, salaryId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/${empId}/payslip/${salaryId}/email`, {});
  }

  
}
