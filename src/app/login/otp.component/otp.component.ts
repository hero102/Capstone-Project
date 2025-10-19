import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, style, transition, animate } from '@angular/animations';
import { AuthService, LoginRequest, LoginResponse } from '../../services/auth';

@Component({
  selector: 'app-otp-verification',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss'],
  animations: [
    trigger('fadeSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class OtpVerificationComponent implements OnInit {
  @Input() usernameOrEmail!: string;

  otp: string = '';
  loading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  maskedMobile: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // ✅ Mask mobile number (e.g., 987******45)
    if (this.usernameOrEmail?.match(/^\d{10}$/)) {
      this.maskedMobile = this.usernameOrEmail.replace(/(\d{2})\d{6}(\d{2})/, '$1******$2');
    } else {
      this.maskedMobile = 'your registered mobile number';
    }
  }

  // ✅ Verify OTP
  verifyOtp(): void {
    if (!this.otp) {
      this.errorMessage = 'Please enter the 6-digit OTP';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const loginData: LoginRequest = {
      usernameOrEmail: this.usernameOrEmail,
      password: '', // No password needed for OTP step
      otp: this.otp,
      captchaToken: '' // optional if CAPTCHA is required
    };

    this.authService.login(loginData).subscribe({
      next: (res: LoginResponse) => {
        this.loading = false;

        if (res.message === 'LOGIN_SUCCESS' && res.jwtToken) {
          // ✅ Save session
          this.authService.saveSession(res);

          this.successMessage = '✅ OTP verified successfully! Redirecting...';

          // ✅ Redirect by role
          setTimeout(() => {
            switch (res.roleName) {
              case 'ROLE_SUPER_ADMIN':
                window.location.href = '/super-admin/dashboard';
                break;
              case 'ROLE_Employee':
                window.location.href = '/dashboard';
                break;
              case 'ROLE_BANK':
                window.location.href = '/bank';
                break;
              case 'ROLE_BANK_ADMIN':
                window.location.href = '/bank-admin/dashboard';
                break;
                 case 'ROLE_ORGANISATION_ADMIN':
         window.location.href = '/org-admin/dashboard';
        break;
              case 'ROLE_CUSTOMER':
                window.location.href = '/customer/dashboard';
                break;
              default:
                window.location.href = '/dashboard';
                break;
            }
          }, 1000);
        } else {
          this.errorMessage = 'Login failed or token missing';
        }
      },
      error: (err: any) => {
        this.loading = false;
        console.error('OTP verification failed:', err);
        this.errorMessage = err.error?.message || 'Invalid or expired OTP';
      }
    });
  }

  // ✅ Resend OTP
  resendOtp(): void {
    if (!this.usernameOrEmail) {
      this.errorMessage = 'Missing user identifier';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.resendOtp(this.usernameOrEmail).subscribe({
      next: () => {
        this.successMessage = '🔁 OTP resent successfully to your registered contact.';
        this.loading = false;
      },
      error: (err: any) => {
        this.loading = false;
        console.error('Resend OTP failed:', err);
        this.errorMessage = err.error?.message || 'Failed to resend OTP. Please try again later.';
      }
    });
  }
}
