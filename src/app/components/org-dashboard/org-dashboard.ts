import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { OrganizationAdminService, OrganizationAdminResponseDto, OrganizationAdminRequestDto } from './organization-admin';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-org-dashboard',
  imports: [CommonModule, FormsModule],
  templateUrl: './org-dashboard.html',
  styleUrls: ['./org-dashboard.scss']
})
export class OrgDashboardComponent implements OnInit {

  organizationId!: number;
  admins: OrganizationAdminResponseDto[] = [];
  loading: boolean = true;
  message: string = '';

  // Form fields
  name: string = '';
  email: string = '';
  phoneNumber: string = '';
  designation: string = '';
  document?: File;

  constructor(private service: OrganizationAdminService) {}

  ngOnInit(): void {
    const username = localStorage.getItem('username');
    if (!username) {
      this.message = 'Username not found in localStorage';
      this.loading = false;
      return;
    }

    this.service.getOrganizationByUsername(username).subscribe({
      next: org => {
        this.organizationId = org.organizationId;
        this.loadAdmins();
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.message = 'Failed to fetch organization info.';
        this.loading = false;
      }
    });
  }

  loadAdmins(): void {
    if (!this.organizationId) return;

    this.loading = true;
    this.service.listAdmins(this.organizationId).subscribe({
      next: (admins: OrganizationAdminResponseDto[]) => {
        this.admins = admins;
        this.message = '';
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.message = 'Failed to load admins.';
      },
      complete: () => this.loading = false
    });
  }

  createAdmin(): void {
    if (!this.name || !this.email || !this.phoneNumber || !this.designation) {
      this.message = 'Please fill all required fields.';
      return;
    }

    if (!this.organizationId) {
      this.message = 'Organization not loaded yet.';
      return;
    }

    const dto: OrganizationAdminRequestDto = {
      name: this.name,
      email: this.email,
      phoneNumber: this.phoneNumber,
      designation: this.designation
    };

    this.service.createAdmin(this.organizationId, dto, this.document).subscribe({
      next: (admin: OrganizationAdminResponseDto) => {
        this.admins.push(admin);
        this.message = 'Admin created successfully!';
        this.resetForm();
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.message = err.error?.message || 'Failed to create admin';
      }
    });
  }

  deactivateAdminWithPrompt(bankAdminId: number, orgAdminId: number): void {
    const reason = prompt('Enter reason for deactivation:');
    if (reason && reason.trim() !== '') {
      this.deactivateAdmin(bankAdminId, orgAdminId, reason);
    } else {
      this.message = 'Deactivation cancelled or reason is empty.';
    }
  }

  deactivateAdmin(bankAdminId: number, orgAdminId: number, reason: string): void {
    this.service.deactivateAdmin(bankAdminId, orgAdminId, reason).subscribe({
      next: (res: string) => {
        this.message = res;
        this.loadAdmins();
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.message = 'Failed to deactivate admin';
      }
    });
  }

  reactivateAdmin(bankAdminId: number, orgAdminId: number): void {
    this.service.reactivateAdmin(bankAdminId, orgAdminId).subscribe({
      next: (res: string) => {
        this.message = res;
        this.loadAdmins();
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.message = 'Failed to reactivate admin';
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.document = input.files[0];
    }
  }

  private resetForm(): void {
    this.name = '';
    this.email = '';
    this.phoneNumber = '';
    this.designation = '';
    this.document = undefined;
  }
}
