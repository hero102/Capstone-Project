import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { RecaptchaComponent, RecaptchaModule } from 'ng-recaptcha';
import { trigger, transition, style, animate } from '@angular/animations';

import { OtpVerificationComponent } from './otp.component/otp.component';
import { AuthService, LoginRequest, LoginResponse } from '../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RecaptchaModule, OtpVerificationComponent, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  animations: [
    trigger('fadeSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(15px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(-10px)' }))
      ])
    ])
  ]
})
export class LoginComponent implements OnInit {
  form: LoginRequest = { usernameOrEmail: '', password: '', captchaToken: '', otp: '' };
  step: 'LOGIN' | 'OTP' = 'LOGIN';
  loading = false;
  error = '';
  returnUrl: string = '/';

  @ViewChild('captchaRef') recaptchaRef!: RecaptchaComponent;

  // Forgot password flow
  showForgotPassword = false;
  reset = {
    identifier: '',
    otp: '',
    newPassword: '',
    step: 'REQUEST' as 'REQUEST' | 'OTP',
    loading: false
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const token = this.authService.getToken();
    const role = this.authService.getUserRole();
    if (token && role) {
      this.redirectByRole(role);
    }

    // Return URL in case user tried to access protected route
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

 onCaptchaResolved(token: string | null) {
  this.form.captchaToken = token || '';
}


  onSubmit() {
    this.error = '';

    if (!this.form.usernameOrEmail || !this.form.password) {
      this.error = 'Please enter your username/email and password.';
      return;
    }

    if (!this.form.captchaToken) {
      this.error = 'Please complete the CAPTCHA.';
      return;
    }

    this.loading = true;

    this.authService.login(this.form).subscribe({
      next: (res: LoginResponse) => {
        this.loading = false;

        if (res.message === 'OTP_REQUIRED') {
          this.step = 'OTP';
          this.resetCaptcha();
          return;
        }

        if (res.message === 'LOGIN_SUCCESS' && res.jwtToken) {
          // Clear old session and save new session
          localStorage.clear();
          this.authService.saveSession(res);

          // Redirect by role
          this.redirectByRole(res.roleName, this.returnUrl);
        } else {
          this.error = 'Invalid login response or missing token.';
          this.resetCaptcha();
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Login failed. Please try again.';
        this.resetCaptcha();
      }
    });
  }

  resendOtp() {
    if (!this.form.usernameOrEmail) {
      this.error = 'Please enter your username or email first.';
      return;
    }

    this.authService.resendOtp(this.form.usernameOrEmail).subscribe({
      next: () => alert('OTP resent successfully.'),
      error: () => alert('Failed to resend OTP. Please try again later.')
    });
  }

  requestResetOtp() {
    if (!this.reset.identifier) {
      this.error = 'Please enter your email or username.';
      return;
    }

    this.reset.loading = true;
    this.authService.requestPasswordReset(this.reset.identifier).subscribe({
      next: () => {
        this.reset.loading = false;
        this.reset.step = 'OTP';
        alert('OTP sent to your registered email.');
      },
      error: (err) => {
        this.reset.loading = false;
        alert(err.error?.message || 'Failed to send OTP.');
      }
    });
  }

  verifyAndResetPassword() {
    if (!this.reset.identifier || !this.reset.otp || !this.reset.newPassword) {
      alert('All fields are required.');
      return;
    }

    this.reset.loading = true;
    this.authService
      .verifyResetOtpAndChangePassword(this.reset.identifier, this.reset.otp, this.reset.newPassword)
      .subscribe({
        next: () => {
          this.reset.loading = false;
          alert('Password reset successful! Please log in again.');
          this.showForgotPassword = false;
          this.reset = { identifier: '', otp: '', newPassword: '', step: 'REQUEST', loading: false };
        },
        error: (err) => {
          this.reset.loading = false;
          alert(err.error?.message || 'Failed to reset password.');
        }
      });
  }

  resetCaptcha() {
    this.form.captchaToken = '';
    try {
      if (this.recaptchaRef) {
        this.recaptchaRef.reset();
        setTimeout(() => {
          const iframe = document.querySelector('iframe[title="reCAPTCHA"]') as HTMLElement;
          iframe?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
      }
    } catch (e) {
      console.warn('Captcha reset failed:', e);
    }
  }

  private redirectByRole(roleName?: string, returnUrl?: string) {
    const role = roleName?.toUpperCase();

    switch (role) {
      case 'ROLE_SUPER_ADMIN':
        this.router.navigate(['/super-admin/dashboard']);
        break;

      case 'ROLE_BANK':
        this.router.navigate(['/bank']);
        break;

      case 'ROLE_ORGANIZATION_ADMIN':
      case 'ROLE_BANK_ADMIN':
        this.router.navigate(['/org-admin/dashboard']);
        break;

      case 'ROLE_EMPLOYEE':
        this.router.navigate(['/dashboard']);
        break;

      default:
        this.router.navigate(['/login']);
        break;
    }
  }
}
