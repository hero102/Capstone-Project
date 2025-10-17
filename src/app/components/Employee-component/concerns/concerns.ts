// import { Component, OnInit } from '@angular/core';
// import { ConcernService } from '../../services/concern';
// import { AuthService } from '../../services/auth';
// import { FormsModule, NgForm, NgModel } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// @Component({
//   selector: 'app-concerns',
//   imports:[FormsModule,CommonModule],
//   templateUrl: './concerns.html'
// })
// export class ConcernsComponent implements OnInit {
//   empId!: number;
//   concerns: any[] = [];
//   subject = '';
//   description = '';
//   priority = 'MEDIUM';
//   selectedFile: File | null = null;
//   message = '';

//   constructor(private concernService: ConcernService, private auth: AuthService) {}

//   ngOnInit(): void {
//     this.empId = this.auth.getEmployeeId();
//     this.loadConcerns();
//   }

//   loadConcerns() {
//     this.concernService.getEmployeeConcerns(this.empId).subscribe({
//       next: (res) => (this.concerns = res),
//       error: (err) => console.error(err)
//     });
//   }

//   onFileSelected(event: any) {
//     this.selectedFile = event.target.files[0];
//   }

//   raiseConcern() {
//     const data = {
//       employeeId: this.empId,
//       subject: this.subject,
//       description: this.description,
//       priority: this.priority
//     };

//     this.concernService.raiseConcern(data, this.selectedFile || undefined).subscribe({
//       next: (res) => {
//         this.message = 'Concern raised successfully!';
//         this.loadConcerns();
//         this.subject = this.description = '';
//         this.selectedFile = null;
//       },
//       error: () => (this.message = 'Error raising concern.')
//     });
//   }

//   deleteConcern(concernId: number) {
//   if (confirm('Are you sure you want to delete this concern?')) {
//     this.concernService.deleteConcern(concernId).subscribe({
//       next: () => {
//         this.message = 'Concern deleted successfully!';
//         this.concerns = this.concerns.filter(c => c.concernId !== concernId);
//       },
//       error: () => {
//         this.message = 'Error deleting concern.';
//       }
//     });
//   }
// }

// }


import { Component, OnInit, NgZone } from '@angular/core';
import { ConcernService } from '../../../services/concern';
import { AuthService } from '../../../services/auth';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-concerns',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './concerns.html'
})
export class ConcernsComponent implements OnInit {
  empId!: number;
  concerns: any[] = [];
  subject = '';
  description = '';
  priority = '';
  selectedFile: File | null = null;

  message = '';
  alertType: 'success' | 'error' | '' = '';
  isLoading = false;

  constructor(
    private concernService: ConcernService,
    private auth: AuthService,
    private zone: NgZone
  ) {}

  ngOnInit(): void {
    this.empId = this.auth.getEmployeeId();
    this.loadConcerns();
  }

  loadConcerns(): void {
    this.isLoading = true;
    this.concernService.getEmployeeConcerns(this.empId).subscribe({
      next: (res) => {
        this.zone.run(() => {
          // change detection will run
          this.concerns = [...res]; // 🔥 create new array reference
          this.isLoading = false;
        });
      },
      error: (err) => {
        console.error(err);
        this.zone.run(() => (this.isLoading = false));
      }
    });
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  raiseConcern(): void {
    if (!this.subject.trim() || !this.description.trim() || !this.priority) {
      this.showAlert('⚠️ Please fill all required fields.', 'error');
      return;
    }

    const data = {
      employeeId: this.empId,
      subject: this.subject.trim(),
      description: this.description.trim(),
      priority: this.priority.trim()
    };

    const formData = new FormData();
    formData.append('data', JSON.stringify(data));
    if (this.selectedFile) formData.append('document', this.selectedFile);

    this.isLoading = true;

    this.concernService.raiseConcern(formData).subscribe({
      next: (res) => {
        console.log('✅ Concern raised:', res);
        this.zone.run(() => {
          this.concerns = [res, ...this.concerns]; // ✅ Force new array ref
          this.showAlert('✅ Concern raised successfully!', 'success');
          this.resetForm();
          this.isLoading = false;
        });
      },
      error: (err) => {
        console.error('Error raising concern:', err);
        this.zone.run(() => {
          this.showAlert('❌ Error raising concern.', 'error');
          this.isLoading = false;
        });
      }
    });
  }

  deleteConcern(concernId: number): void {
    if (!confirm('🗑 Are you sure you want to delete this concern?')) return;
    this.isLoading = true;

    this.concernService.deleteConcern(concernId).subscribe({
      next: () => {
        this.zone.run(() => {
          this.concerns = this.concerns.filter(c => c.concernId !== concernId); // ✅ New array instance
          this.showAlert('🗑 Concern deleted successfully!', 'success');
          this.isLoading = false;
        });
      },
      error: (err) => {
        console.error('Error deleting concern:', err);
        this.zone.run(() => {
          this.showAlert('❌ Error deleting concern.', 'error');
          this.isLoading = false;
        });
      }
    });
  }

  private resetForm(): void {
    this.subject = '';
    this.description = '';
    this.priority = '';
    this.selectedFile = null;
  }

  private showAlert(msg: string, type: 'success' | 'error'): void {
    this.message = msg;
    this.alertType = type;
    setTimeout(() => {
      this.message = '';
      this.alertType = '';
    }, 2500);
  }
}
