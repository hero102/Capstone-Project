import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, tap, throwError } from 'rxjs';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = localStorage.getItem('token'); // match your stored token key

  // Attach JWT token if available
  const authReq = token
    ? req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      })
    : req;

  return next(authReq).pipe(
    tap({
      error: (error: HttpErrorResponse) => {
        console.error('[JWT-ERROR]', { status: error.status, url: req.url, message: error.message });
      },
    }),
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 || error.status === 403) {
        console.warn('[JWT-REDIRECT] Unauthorized — redirecting to login');
        localStorage.removeItem('token');       // make sure this key matches your login storage
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};
