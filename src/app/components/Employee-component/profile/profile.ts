import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../../services/employee';
import { AuthService } from '../../../services/auth';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-profile',
  imports:[CommonModule],
  templateUrl: './profile.html'
})
export class ProfileComponent implements OnInit {
  empId!: number;
  profile: any;
  selectedFile: File | null = null;
  message = '';

  constructor(private empService: EmployeeService, private auth: AuthService) {}

  ngOnInit(): void {
    this.empId = this.auth.getEmployeeId();
    this.loadProfile();
  }

  loadProfile() {
    this.empService.getProfile(this.empId).subscribe({
      next: (res) => (this.profile = res),
      error: (err) => console.error('Profile load error:', err)
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  uploadPhoto() {
    if (this.selectedFile) {
      this.empService.uploadPhoto(this.empId, this.selectedFile).subscribe({
        next: (res) => {
          this.message = res.message;
          this.loadProfile();
        },
        error: (err) => (this.message = 'Error uploading photo.')
      });
    } else {
      this.message = 'Please select a file first.';
    }
  }
}
