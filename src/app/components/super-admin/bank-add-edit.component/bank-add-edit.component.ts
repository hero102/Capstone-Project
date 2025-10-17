import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RecaptchaModule } from 'ng-recaptcha';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SuperAdminService } from '../../../services/super-admin/super-admin-service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-add-edit-bank',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RecaptchaModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './bank-add-edit.component.html',
  styleUrls: ['./bank-add-edit.component.scss']
})
export class AddEditBankComponent implements OnInit {
  @Input() editData: any = null;
  @Output() bankAddedOrUpdated = new EventEmitter<void>();
  @Output() closeForm = new EventEmitter<void>();

  bankForm!: FormGroup;
  documentFile: File | null = null;

  captchaToken = '';
  formSubmitted = false;
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private superAdminService: SuperAdminService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.initForms();

    if (this.editData) {
      this.bankForm.patchValue(this.editData);
      this.setEditModeFields();
    }
  }

  /** Initialize form */
  private initForms(): void {
    this.bankForm = this.fb.group({
      bankName: ['', Validators.required],
      branch: ['', Validators.required],
      bankIdentifier: ['', Validators.required],
      headOfficeAddress: ['', Validators.required],
      registrationNumber: ['', Validators.required],
      officialEmail: ['', [Validators.required, Validators.email]],
      officialPhone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      documentUrl: [null],
      active: [true] // ✅ Default active
    });
  }

  /** Allow only specific fields to be editable during edit */
  private setEditModeFields(): void {
    const allControls = Object.keys(this.bankForm.controls);
    const editableFields = ['officialEmail', 'officialPhone', 'headOfficeAddress'];

    allControls.forEach(field => {
      if (!editableFields.includes(field)) {
        this.bankForm.get(field)?.disable(); // ❌ make read-only
      }
    });
  }

onFileChange(event: Event): void {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  // ✅ Allowed MIME types
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
  const maxSizeMB = 5;

  // ❌ Invalid type
  if (!allowedTypes.includes(file.type)) {
    this.showToast('⚠️ Only PDF and image files (JPG, PNG) are allowed.', 'warn');
    input.value = ''; // Reset input
    return;
  }

  // ❌ Exceeds size limit
  if (file.size > maxSizeMB * 1024 * 1024) {
    this.showToast(`⚠️ File size must not exceed ${maxSizeMB} MB.`, 'warn');
    input.value = '';
    return;
  }

  // ✅ Valid file
  this.documentFile = file;
  this.bankForm.patchValue({ documentUrl: file.name });
}


  onCaptchaResolved(token: string | null): void {
    this.captchaToken = token || '';
  }

  /** Submit (register or update) */
  submit(): void {
    this.formSubmitted = true;

    if (this.bankForm.invalid || (!this.editData && !this.captchaToken)) {
      this.showToast('⚠️ Please complete all required fields and CAPTCHA.', 'warn');
      return;
    }

    this.isSubmitting = true;
    const formData = new FormData();
    const bankData = this.bankForm.getRawValue();
    bankData.active = true; // ✅ Ensure always active

    formData.append('data', new Blob([JSON.stringify(bankData)], { type: 'application/json' }));
    if (this.documentFile) formData.append('document', this.documentFile);

    const request$ = this.editData
      ? this.superAdminService.updateBank(this.editData.bankId, formData)
      : this.superAdminService.registerBank(formData);

    request$
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: () => {
          this.showToast('✅ Bank saved successfully and is now active.', 'success');
          this.bankAddedOrUpdated.emit(); // Notify dashboard to reload
          this.resetForm();
        },
        error: (err) => {
          console.error('❌ Error:', err);
          this.showToast(err.message || 'Submission failed.', 'error');
        }
      });
  }

  private showToast(message: string, type: 'success' | 'error' | 'warn'): void {
    const panelClass = {
      success: ['toast-success'],
      error: ['toast-error'],
      warn: ['toast-warn']
    }[type];

    this.snackBar.open(message, 'OK', {
      duration: 3000,
      panelClass,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }

  private resetForm(): void {
    this.bankForm.reset();
    this.captchaToken = '';
    this.documentFile = null;
    this.closeForm.emit();
  }
}
