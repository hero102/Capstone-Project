import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-bank-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bank-admin-login.html',
  styleUrls: ['./bank-admin-login.scss']
})
export class BankAdminLogin {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  loading: boolean = false;

  private apiUrl = 'http://localhost:8080/api/auth'; // ✅ Updated base URL

  constructor(private http: HttpClient, private router: Router) {}

  login(): void {
    this.loading = true;
    const credentials = { email: this.email, password: this.password };

    this.http.post(`${this.apiUrl}/bank-admin-login`, credentials).subscribe({
      next: (response: any) => {
        console.log('✅ Login success:', response);

        // Save details for session
        localStorage.setItem('bankAdmin', JSON.stringify(response));

        // Navigate to dashboard
        this.router.navigate(['/bank-admin/dashboard']);
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Login failed:', err);
        this.errorMessage = err.error?.message || 'Invalid email or password';
        this.loading = false;
      }
    });
  }
}
