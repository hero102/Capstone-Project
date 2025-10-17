import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule, Validators } from '@angular/forms';
import { BankAdmin, BankService, Organization } from '../../services/Bank-Service/bank-service';


@Component({
  selector: 'app-bank-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './bank-dashboard.component.html',
  styleUrls: ['./bank-dashboard.component.scss']
})
export class BankDashboardComponent implements OnInit {
  passwordForm!: FormGroup;
  adminForm!: FormGroup;
  showPasswordForm = false;
  showForm = false;
  isEditing = false;
  loading = false;

  bankAdmins: BankAdmin[] = [];


  selectedFile: File | null = null;
  editingAdminId: number | null = null;
  bankId = 1; // change to logged-in bank ID if dynamic

  constructor(private fb: FormBuilder, private bankService: BankService) {}

  ngOnInit(): void {
    this.initForms();
    this.loadData();
  }

  private initForms() {
    this.passwordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.adminForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
    });
  }

  private loadData() {
    this.loadBankAdmins();
  }

  loadBankAdmins() {
    this.bankService.getAllBankAdmins(this.bankId).subscribe({
      next: (data) => (this.bankAdmins = data),
      error: (err) => console.error('Error loading bank admins:', err)
    });
  }

 

  // 🔐 Password Update
  onPasswordSubmit() {
    if (this.passwordForm.invalid) return;
    const { oldPassword, newPassword } = this.passwordForm.value;

    this.bankService.updateBankPassword(this.bankId, oldPassword, newPassword).subscribe({
      next: () => {
        alert('Password updated successfully!');
        this.passwordForm.reset();
        this.showPasswordForm = false;
      },
      error: (err) => alert('Error updating password: ' + err)
    });
  }

  // 🧾 File Change
  onFileChange(event: any) {
    const file = event.target.files?.[0];
    if (file && file.size < 5 * 1024 * 1024) this.selectedFile = file;
    else alert('File too large (max 5MB)');
  }

  // ➕ Add/Edit Admin
  openAddForm() {
    this.resetForm();
    this.showForm = true;
  }

  editAdmin(admin: BankAdmin) {
    this.adminForm.patchValue(admin);
    this.isEditing = true;
    this.editingAdminId = admin.bankAdminId || null;
    this.showForm = true;
  }

  resetForm() {
    this.adminForm.reset();
    this.showForm = false;
    this.isEditing = false;
    this.editingAdminId = null;
    this.selectedFile = null;
  }

  onSubmit() {
    if (this.adminForm.invalid) return;

    this.loading = true;
    const data = this.adminForm.value;

    const request$ = this.isEditing
      ? this.bankService.updateBankAdmin(this.bankId, this.editingAdminId!, data, this.selectedFile!)
      : this.bankService.addBankAdmin(this.bankId, data, this.selectedFile!);

    request$.subscribe({
      next: () => {
        alert(this.isEditing ? 'Admin updated!' : 'Admin added!');
          window.location.reload();
        this.resetForm();
      },
      error: (err) => alert('Error saving admin: ' + err),
      complete: () => (this.loading = false)
    });
  }

  // 🗑 Delete Admin
  deleteAdmin(adminId: number) {
    if (confirm('Are you sure you want to delete this admin?')) {
      this.bankService.deleteBankAdmin(this.bankId, adminId).subscribe({
        next: () => {
          alert('Admin deleted successfully');
          this.loadBankAdmins();
          window.location.reload();
        },
        error: (err) => alert('Error deleting admin: ' + err)
      });
    }
  }

  // 🚪 Logout
  logout() {
    localStorage.clear();
    window.location.href = '/login';
  }
}
