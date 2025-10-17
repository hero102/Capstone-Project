import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SuperAdminService } from '../../../services/super-admin/super-admin-service';
import { AddEditBankComponent } from '../bank-add-edit.component/bank-add-edit.component';

@Component({
  selector: 'app-super-admin-dashboard',
  standalone: true,
  imports: [CommonModule, AddEditBankComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class SuperAdminDashboardComponent implements OnInit {
  banks: any[] = [];
  loading = false;
  showForm = false;
  editData: any = null;
  togglingBankId: number | null = null;
  deletingBankId: number | null = null;

  constructor(private superAdminService: SuperAdminService) {}

  ngOnInit(): void {
    this.loadBanks();
  }

  loadBanks(showLoader: boolean = true): void {
    if (showLoader) this.loading = true;

    this.superAdminService.getAllBanks().subscribe({
      next: (res) => {
        this.banks = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load banks:', err);
        this.loading = false;
      }
    });
  }

  onAddBank(): void {
    this.showForm = true;
    this.editData = null;
  }

  onEditBank(bank: any): void {
    this.showForm = true;
    this.editData = bank;
  }

  onDeleteBank(id: number): void {
    if (!confirm('Are you sure you want to delete this bank?')) return;

    this.deletingBankId = id;

    this.superAdminService.deleteBank(id).subscribe({
      next: () => {
        alert('✅ Bank deleted successfully');
        this.deletingBankId = null;
        this.loadBanks(false); // reloads fresh list
      },
      error: (err) => {
        console.error('Delete failed:', err);
        alert('❌ Failed to delete bank');
        this.deletingBankId = null;
      }
    });
  }

  toggleBankStatus(bank: any): void {
    const newStatus = !bank.active; // ✅ fixed: use `active`, not `isActive`
    const confirmMsg = newStatus
      ? `Activate ${bank.bankName}?`
      : `Deactivate ${bank.bankName}?`;

    if (!confirm(confirmMsg)) return;

    this.togglingBankId = bank.bankId;

    this.superAdminService.toggleBankStatus(bank.bankId, newStatus).subscribe({
      next: (updatedBank) => {
        alert(`✅ Bank ${newStatus ? 'activated' : 'deactivated'} successfully`);
        
        // ✅ Update from backend response to ensure sync
        const index = this.banks.findIndex(b => b.bankId === bank.bankId);
        if (index !== -1) {
          this.banks[index] = updatedBank; // use backend response
          this.banks = [...this.banks]; // force Angular refresh
        }

        this.togglingBankId = null;
      },
      error: (err) => {
        console.error('Toggle failed:', err);
        alert('❌ Failed to update bank status');
        this.togglingBankId = null;
      },
    });
  }

  onBankAddedOrUpdated(): void {
    this.showForm = false;
    this.loadBanks(false);
  }

  closeForm(): void {
    this.showForm = false;
    this.editData = null;
  }
  logout(): void {
  if (confirm('Are you sure you want to logout?')) {
    // Clear stored session data
    localStorage.clear();
    sessionStorage.clear();

    // Navigate to login (you can adjust this route)
    window.location.href = '/login';
  }
}

}
