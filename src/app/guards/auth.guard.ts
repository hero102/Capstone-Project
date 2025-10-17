import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth'; // adjust path as needed

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private authService: AuthService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = this.authService.getToken(); // uses AuthService
    const userRole = this.authService.getUserRole();

    // 🔒 Not logged in → redirect to login
    if (!token) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }

    // 🎭 Role-based restriction
    const allowedRoles = route.data['roles'] as string[] | undefined;
    if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
      this.router.navigate(['/unauthorized']); // or '/login'
      return false;
    }

    // ✅ Authorized
    return true;
  }
}
