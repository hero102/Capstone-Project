import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

// =======================
// 📘 Interfaces
// =======================
export interface BankAdmin {
  bankAdminId?: number;
  name: string;
  email: string;
  phoneNumber: string;
  documentUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Organization {
  organizationId: number;
  name: string;
  email: string;
  phone: string;
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt?: string;
}

// =======================
// 🏦 Service Definition
// =======================
@Injectable({
  providedIn: 'root'
})
export class BankService {

  // ✅ Direct base URL (no environment or apiUrl)
  private baseUrl = 'http://localhost:8080/api/bank-admins';

  constructor(private http: HttpClient) {}

  // =======================
  // 🔹 BANK ADMIN CRUD
  // =======================

  /** ✅ Get all Bank Admins under a specific Bank */
  getAllBankAdmins(bankId: number): Observable<BankAdmin[]> {
    return this.http
      .get<BankAdmin[]>(`${this.baseUrl}/bank/${bankId}`)
      .pipe(catchError(this.handleError));
  }

  /** ✅ Add new Bank Admin (with optional document) */
  addBankAdmin(bankId: number, data: BankAdmin, file?: File): Observable<any> {
    const formData = new FormData();
    formData.append('data', JSON.stringify(data));
    if (file) formData.append('document', file);

    return this.http
      .post(`${this.baseUrl}/${bankId}/create`, formData)
      .pipe(catchError(this.handleError));
  }

  /** ✅ Update existing Bank Admin (with optional document) */
  updateBankAdmin(bankId: number, adminId: number, data: BankAdmin, file?: File): Observable<any> {
    const formData = new FormData();
    formData.append('data', JSON.stringify(data));
    if (file) formData.append('document', file);

    return this.http
      .put(`${this.baseUrl}/${bankId}/update-bank-admin/${adminId}`, formData)
      .pipe(catchError(this.handleError));
  }

  /** ✅ Update Bank Password */
  updateBankPassword(bankId: number, oldPassword: string, newPassword: string): Observable<any> {
    return this.http
      .put(`http://localhost:8080/api/banks/${bankId}/update-password`, null, {
        params: { oldPassword, newPassword }
      })
      .pipe(catchError(this.handleError));
  }

  /** ✅ Permanently delete a Bank Admin */
  deleteBankAdmin(bankId: number, adminId: number): Observable<any> {
    return this.http
      .delete(`${this.baseUrl}/${bankId}/delete-bank-admin/${adminId}`)
      .pipe(catchError(this.handleError));
  }

  
  // =======================
  // ⚠️ Error Handling
  // =======================
  private handleError(error: any) {
    console.error('[BankService Error]', error);
    const msg = error?.error?.message || error?.message || 'Server error occurred';
    return throwError(() => msg);
  }
}
