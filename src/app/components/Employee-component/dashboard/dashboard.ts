import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../../services/employee';
import { AuthService } from '../../../services/auth';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgClass, NgIf } from '@angular/common';
@Component({
  selector: 'app-dashboard',
  imports:[FormsModule,CommonModule,NgIf],
  templateUrl: './dashboard.html'
})
export class DashboardComponent implements OnInit {
  data: any;
  empId!: number;

  constructor(private empService: EmployeeService, private auth: AuthService) {}

  ngOnInit(): void {
    this.empId = this.auth.getEmployeeId();
    this.empService.getDashboard(this.empId).subscribe((res) => (this.data = res));
  }

  logout() {
    this.auth.logout();
  }
}
