import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SuperAdminService {
  private baseUrl = 'http://localhost:8080/api/super-admin';

  constructor(private http: HttpClient) {}

  getAllBanks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/banks`);
  }

  registerBank(data: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/register-bank`, data);
  }

  updateBank(bankId: number, data: FormData): Observable<any> {
    return this.http.put(`${this.baseUrl}/banks/${bankId}`, data);
  }

  deleteBank(bankId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${bankId}`);
  }

  toggleBankStatus(bankId: number, active: boolean): Observable<any> {
    return this.http.put(`${this.baseUrl}/banks/${bankId}/status?active=${active}`, {});
  }

  // OTP helpers
  verifyBankOtp(identifier: string, otp: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/verify-otp?otp=${otp}`, { contact: identifier, email: identifier });
  }

  resendBankOtp(identifier: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/resend-otp`, { contact: identifier, email: identifier });
  }
}
