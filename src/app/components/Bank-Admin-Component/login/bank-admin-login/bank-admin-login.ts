// bank-admin-login.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-bank-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './bank-admin-login.html'
})
export class BankAdminLoginComponent {
  email = '';
  password = '';
  loading = false;
  error = '';

  constructor(private http: HttpClient, private router: Router) {}

  onLogin() {
    this.loading = true;
    this.error = '';
    
    this.http.post('http://localhost:8080/api/auth/bank-admin-login', {
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res: any) => {
        localStorage.setItem('bankAdminId', res.bankAdminId);
        localStorage.setItem('bankAdminName', res.name);
        localStorage.setItem('bankId', res.bankId);
        localStorage.setItem('role', 'BANK_ADMIN');
        this.router.navigate(['/bank-admin/dashboard']);
      },
      error: (err) => {
        this.error = err.error?.message || 'Invalid credentials';
        this.loading = false;
      }
    });
  }
}