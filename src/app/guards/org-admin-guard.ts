// // src/app/guards/org-admin.guard.ts

// import { Injectable } from '@angular/core';
// import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
// import { OrgAdminService } from '../services/org-admin';

// @Injectable({
//   providedIn: 'root'
// })
// export class OrgAdminGuard implements CanActivate {
  
//   constructor(
//     private router: Router,
//     private orgAdminService: OrgAdminService
//   ) {}

//   canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
//     if (this.orgAdminService.isLoggedIn()) {
//       return true;
//     }

//     // Redirect to login
//     this.router.navigate(['/org-admin/login']);
//     return false;
//   }
// }