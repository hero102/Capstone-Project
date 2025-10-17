// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { BankAdminService } from '../../../services/bank-admin';

// @Component({
//   selector: 'app-create-admin',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   template: `
//     <div style="max-width: 600px; margin: 20px auto; padding: 30px; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
//       <h2 style="margin-bottom: 30px; color: #333;">➕ Create Bank Admin</h2>

//       <div style="margin-bottom: 20px;">
//         <label style="display: block; margin-bottom: 5px; font-weight: 500;">Name: *</label>
//         <input type="text" [(ngModel)]="admin.name" placeholder="Enter full name"
//           style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; box-sizing: border-box;">
//       </div>

//       <div style="margin-bottom: 20px;">
//         <label style="display: block; margin-bottom: 5px; font-weight: 500;">Email: *</label>
//         <input type="email" [(ngModel)]="admin.email" placeholder="Enter email address"
//           style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; box-sizing: border-box;">
//       </div>

//       <div style="margin-bottom: 20px;">
//         <label style="display: block; margin-bottom: 5px; font-weight: 500;">Phone Number: *</label>
//         <input type="tel" [(ngModel)]="admin.phoneNumber" placeholder="Enter phone number"
//           style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; box-sizing: border-box;">
//       </div>

//       <div style="margin-bottom: 25px;">
//         <label style="display: block; margin-bottom: 5px; font-weight: 500;">Document (Optional):</label>
//         <input type="file" (change)="onFileSelect($event)" accept=".pdf,.jpg,.jpeg,.png"
//           style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
//         <small style="color: #666; display: block; margin-top: 5px;">Supported: PDF, JPG, PNG (Max 5MB)</small>
//       </div>

//       <button (click)="onCreate()" 
//         [disabled]="!admin.name || !admin.email || !admin.phoneNumber || loading"
//         [style.opacity]="!admin.name || !admin.email || !admin.phoneNumber || loading ? '0.6' : '1'"
//         style="width: 100%; padding: 12px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; font-weight: 500;">
//         {{ loading ? 'Creating...' : 'Create Bank Admin' }}
//       </button>

//       <div *ngIf="message" 
//         [style.background]="success ? '#d4edda' : '#f8d7da'" 
//         [style.color]="success ? '#155724' : '#721c24'"
//         style="margin-top: 20px; padding: 15px; border-radius: 4px; font-size: 14px;">
//         {{ message }}
//       </div>
//     </div>
//   `
// })
// export class CreateAdminComponent {
//   admin = { name: '', email: '', phoneNumber: '' };
//   document: File | null = null;
//   loading = false;
//   message = '';
//   success = false;

//   constructor(private service: BankAdminService) {}

//   onFileSelect(event: any) {
//     const file = event.target.files[0];
//     if (file && file.size > 5 * 1024 * 1024) {
//       alert('File size exceeds 5MB limit');
//       return;
//     }
//     this.document = file;
//   }

//   onCreate() {
//     const bankId = Number(localStorage.getItem('bankId'));
//     const formData = new FormData();
//     formData.append('data', JSON.stringify(this.admin));
//     if (this.document) {
//       formData.append('document', this.document);
//     }

//     this.loading = true;
//     this.service.createBankAdmin(bankId, formData).subscribe({
//       next: () => {
//         this.message = '✅ Bank Admin created successfully! Credentials sent via email.';
//         this.success = true;
//         this.loading = false;
//         this.admin = { name: '', email: '', phoneNumber: '' };
//         this.document = null;
//         setTimeout(() => this.message = '', 5000);
//       },
//       error: (err) => {
//         this.message = '❌ ' + (err.error?.message || 'Creation failed');
//         this.success = false;
//         this.loading = false;
//       }
//     });
//   }
// }


import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BankAdminService } from '../../../services/bank-admin';

@Component({
  selector: 'app-create-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div style="max-width:600px;margin:20px auto;padding:30px;background:white;border-radius:8px;box-shadow:0 2px 4px rgba(0,0,0,0.1);">
      <h2 style="margin-bottom:30px;color:#333;">➕ Create Bank Admin</h2>

      <div style="margin-bottom:20px;">
        <label style="display:block;margin-bottom:5px;font-weight:500;">Name: *</label>
        <input type="text" [(ngModel)]="admin.name" placeholder="Enter full name"
          style="width:100%;padding:10px;border:1px solid #ddd;border-radius:4px;box-sizing:border-box;">
      </div>

      <div style="margin-bottom:20px;">
        <label style="display:block;margin-bottom:5px;font-weight:500;">Email: *</label>
        <input type="email" [(ngModel)]="admin.email" placeholder="Enter email"
          style="width:100%;padding:10px;border:1px solid #ddd;border-radius:4px;box-sizing:border-box;">
      </div>

      <div style="margin-bottom:20px;">
        <label style="display:block;margin-bottom:5px;font-weight:500;">Phone: *</label>
        <input type="tel" [(ngModel)]="admin.phoneNumber" placeholder="Enter phone"
          style="width:100%;padding:10px;border:1px solid #ddd;border-radius:4px;box-sizing:border-box;">
      </div>

      <div style="margin-bottom:25px;">
        <label style="display:block;margin-bottom:5px;font-weight:500;">Document (Optional):</label>
        <input type="file" (change)="onFileSelect($event)" accept=".pdf,.jpg,.jpeg,.png"
          style="width:100%;padding:10px;border:1px solid #ddd;border-radius:4px;box-sizing:border-box;">
        <small style="color:#666;display:block;margin-top:5px;">PDF, JPG, PNG (Max 5MB)</small>
      </div>

      <button (click)="onCreate()" 
        [disabled]="!admin.name||!admin.email||!admin.phoneNumber||loading"
        [style.opacity]="!admin.name||!admin.email||!admin.phoneNumber||loading?'0.6':'1'"
        style="width:100%;padding:12px;background:#007bff;color:white;border:none;border-radius:4px;cursor:pointer;font-size:16px;font-weight:500;">
        {{loading?'Creating...':'Create Bank Admin'}}
      </button>

      <div *ngIf="message" 
        [style.background]="success?'#d4edda':'#f8d7da'" 
        [style.color]="success?'#155724':'#721c24'"
        style="margin-top:20px;padding:15px;border-radius:4px;">
        {{message}}
      </div>
    </div>
  `
})
export class CreateAdminComponent {
  admin = { name: '', email: '', phoneNumber: '' };
  document: File | null = null;
  loading = false;
  message = '';
  success = false;

  constructor(private service: BankAdminService) {}

  onFileSelect(event: any) {
    const file = event.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB limit');
      return;
    }
    this.document = file;
  }

  onCreate() {
    // ✅ HARDCODED: Using bankId = 2
    const bankId = 2;  // 🔥 TEMPORARY FIX
    
    console.log('Creating admin for bankId:', bankId);
    
    const formData = new FormData();
    formData.append('data', JSON.stringify(this.admin));
    if (this.document) {
      formData.append('document', this.document);
    }

    this.loading = true;
    this.service.createBankAdmin(bankId, formData).subscribe({
      next: () => {
        this.message = '✅ Bank Admin created successfully for Bank ID: 2!';
        this.success = true;
        this.loading = false;
        this.admin = { name: '', email: '', phoneNumber: '' };
        this.document = null;
        setTimeout(() => this.message = '', 5000);
      },
      error: (err) => {
        console.error('Create Admin Error:', err);
        this.message = '❌ ' + (err.error?.message || err.error || 'Creation failed');
        this.success = false;
        this.loading = false;
      }
    });
  }
}


// ============================================================
// ALTERNATIVE: Use localStorage with fallback to 2
// ============================================================
