import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SuperAdminService } from '../../../services/super-admin/super-admin-service';

@Component({
  selector: 'app-bank-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bank-list.component.html',
  styleUrls: ['./bank-list.component.scss']
})
export class BankListComponent implements OnInit {
  banks: any[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private superAdminService: SuperAdminService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadBanks();
  }

  // ✅ Fetch all banks
  loadBanks(): void {
    this.loading = true;
    this.errorMessage = '';

    this.superAdminService.getAllBanks().subscribe({
      next: (res) => {
        this.banks = res || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading banks:', err);
        this.errorMessage = 'Failed to load banks. Please try again later.';
        this.loading = false;
      }
    });
  }

  // ✅ Navigate to Add Bank page
  onAddBank(): void {
    this.router.navigate(['/super-admin/banks/add']);
  }

  // ✅ Navigate to Edit Bank page
  onEditBank(id: number): void {
    this.router.navigate(['/super-admin/banks/edit', id]);
  }

  // ✅ Toggle Bank Active Status
  toggleStatus(bank: any): void {
    const action = bank.active ? 'Deactivate' : 'Activate';
    if (!confirm(`Are you sure you want to ${action} "${bank.bankName}"?`)) return;

    const updatedBank = { ...bank, active: !bank.active };

    this.superAdminService.updateBank(bank.bankId, updatedBank).subscribe({
      next: () => this.loadBanks(),
      error: (err) => {
        console.error('Status update failed:', err);
        alert('Failed to update bank status. Please try again.');
      }
    });
  }

  // ✅ Delete Bank (with confirmation)
  onDeleteBank(id: number): void {
    if (!confirm('Are you sure you want to delete this bank? This action cannot be undone.')) return;

    this.superAdminService.deleteBank(id).subscribe({
      next: () => {
        alert('Bank deleted successfully.');
        this.loadBanks();
      },
      error: (err) => {
        console.error('Delete failed:', err);
        alert('Failed to delete bank. Please try again.');
      }
    });
  }
}
