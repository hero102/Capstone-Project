import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

// 🔹 Request + Response interfaces
export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
  captchaToken: string;
  otp?: string;
}

export interface LoginResponse {
  message: string;
  jwtToken?: string;
  roleName?: string;
  username?: string;
  employeeId?: number;
  email?: string;
}

// ✅ Main Auth Service
@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'http://localhost:8080/api/auth';

  private TOKEN_KEY = 'token';
  private ROLE_KEY = 'role';
  private USERNAME_KEY = 'username';
  private EMAIL_KEY = 'email';
  private EMP_ID_KEY = 'employeeId';
  private ORG_ID_KEY = 'organizationId';
  private ORG_ADMIN_KEY = 'orgAdminId';

  constructor(private http: HttpClient, private router: Router) {}

  // ✅ Login
  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, data);
  }

  // ✅ Resend OTP
  resendOtp(usernameOrEmail: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/resend-otp`, { usernameOrEmail });
  }

  // ✅ Request password reset (send OTP to email)
requestPasswordReset(identifier: string): Observable<any> {
  return this.http.post(`${this.baseUrl}/forgot-password/request`, { identifier });
}

// ✅ Verify OTP and reset password
verifyResetOtpAndChangePassword(identifier: string, otp: string, newPassword: string): Observable<any> {
  return this.http.post(`${this.baseUrl}/forgot-password/verify`, {
    identifier,
    otp,
    newPassword
  });
}


  // ✅ Save session data (after login success)
 // ✅ Save session data (after login success)
saveSession(res: LoginResponse) {
  if (res.jwtToken) localStorage.setItem(this.TOKEN_KEY, res.jwtToken);
  if (res.roleName) localStorage.setItem(this.ROLE_KEY, res.roleName);
  if (res.username) localStorage.setItem(this.USERNAME_KEY, res.username);
  if (res.email) localStorage.setItem(this.EMAIL_KEY, res.email);
  if (res.employeeId) localStorage.setItem(this.EMP_ID_KEY, String(res.employeeId));

  // ✅ Store combined user info for dashboard usage
  const userObject = {
    username: res.username,
    email: res.email,
    role: res.roleName
  };
  localStorage.setItem('user', JSON.stringify(userObject));

  console.log('✅ Session saved:', userObject);
}


  // ✅ Get stored JWT token
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // ✅ Get stored role
  getUserRole(): string | null {
    return localStorage.getItem(this.ROLE_KEY);
  }

  // ✅ Get username
  getUsername(): string | null {
    return localStorage.getItem(this.USERNAME_KEY);
  }

getEmployeeId(): number {
  const id = localStorage.getItem('employeeId');
  return id ? parseInt(id, 10) : 0; // fallback 0 if not found
}



  // ✅ Logout (clear everything)
  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  // ✅ Check if logged in
  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  // ✅ Organization Admin Login (optional if needed)
  orgAdminLogin(data: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/org-admin-login`, data).pipe(
      tap((res: any) => {
        if (res.jwtToken) localStorage.setItem(this.TOKEN_KEY, res.jwtToken);
        if (res.roleName) localStorage.setItem(this.ROLE_KEY, res.roleName);
        if (res.orgAdminId) localStorage.setItem(this.ORG_ADMIN_KEY, res.orgAdminId);
        if (res.organizationId) localStorage.setItem(this.ORG_ID_KEY, res.organizationId);
        if (res.email) localStorage.setItem(this.EMAIL_KEY, res.email);
      })
    );
  }
}