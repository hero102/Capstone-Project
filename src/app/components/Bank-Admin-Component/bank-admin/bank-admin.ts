import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DatePipe, DecimalPipe } from '@angular/common';

interface BankAdmin {
  bankAdminId: number;
  name: string;
  email: string;
  phoneNumber: string;
  status: string;
  bankName: string;
  bankId: number;
}

interface Organization {
  organizationId: number;
  name: string;
  officialEmail: string;
  contactNumber: string;
  address: string;
  registrationNumber: string;
  status: string;
  documentUrl: string;
  rejectionReason: string;
  bankName: string;
  assignedBankAdmin: string;
  createdAt: string;
}

interface Employee {
  employeeId: number;
  name: string;
  email: string;
  phoneNumber: string;
  designation: string;
  department: string;
  organizationName: string;
  status: string;
  documentUrl: string;
}

interface DisbursementRequest {
  requestId: number;
  organizationName: string;
  month: string;
  totalAmount: number;
  status: string;
  requestedAt: string;
}

interface Concern {
  concernId: number;
  subject: string;
  description: string;
  status: string;
  priority: string;
  documentUrl: string;
  organizationReply: string;
  bankAdminReply: string;
  raisedAt: string;
  resolvedAt: string;
  employeeName: string;
  organizationAdminName: string;
  bankAdminName: string;
}

interface VendorPayment {
  paymentId: number;
  vendorName: string;
  amount: number;
  paymentPurpose: string;
  paymentMode: string;
  status: string;
  transactionId: string;
  approvedAt: string;
}

interface VendorBankAccount {
  accountId: number;
  vendorName: string;
  bankName: string;
  branch: string;
  ifscCode: string;
  accountNumber: string;
  balance: number;
  status: string;
}

@Component({
  selector: 'app-bank-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, DecimalPipe],
  templateUrl: './bank-admin.html'
})
export class BankAdminComponent implements OnInit {
  private apiUrl = 'http://localhost:8080/api';

  bankAdmin: BankAdmin | null = null;
  activeTab = 'dashboard';

  // Dashboard Data
  dashboardStats: any = {
    pendingOrganizations: 0,
    totalOrganizations: 0,
    pendingEmployees: 0,
    pendingDisbursements: 0,
    pendingConcerns: 0,
    pendingVendorPayments: 0,
    bankName: '',
    bankAdminName: ''
  };

  // Organization Management
  pendingOrganizations: Organization[] = [];
  allOrganizations: Organization[] = [];
  organizationForm = {
    name: '',
    officialEmail: '',
    contactNumber: '',
    address: '',
    registrationNumber: '',
    document: null as File | null
  };

  // Employee Management
  pendingEmployees: Employee[] = [];

  // Disbursement Management
  pendingDisbursements: DisbursementRequest[] = [];

  // Concern Management
  bankAdminConcerns: Concern[] = [];
  selectedConcern: Concern | null = null;
  concernReplyForm = {
    concernId: 0,
    replyMessage: '',
    replyBy: 'BANK_ADMIN',
    newStatus: 'RESOLVED'
  };

  // Vendor Payment Management
  pendingVendorPayments: VendorPayment[] = [];
  allVendorPayments: VendorPayment[] = [];
  pendingVendorAccounts: VendorBankAccount[] = [];

  // UI States
  loading = false;
  message = '';
  messageType: 'success' | 'error' | 'info' = 'info';
  showOrgForm = false;
  showConcernReplyModal = false;
  rejectionReason = '';
  selectedItemId: number | null = null;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadBankAdminData();
  }

 loadBankAdminData(): void {
  // 1️⃣ Get localStorage values
  const storedUsername = localStorage.getItem('username');
  const storedRole = localStorage.getItem('role');

  console.log('BankAdmin load:', storedUsername, storedRole);

  // 2️⃣ If not logged in as bank admin, clear storage & redirect
  if (!storedUsername || storedRole !== 'ROLE_BANK_ADMIN') {
    console.warn('Bank Admin not logged in or role mismatch, redirecting to login...');
    localStorage.clear(); // optional, but safe
    this.router.navigate(['/bank-admin/login']);
    return; // stop further execution
  }

  // 3️⃣ Prevent multiple HTTP calls if already loaded
  if (this.bankAdmin) {
    console.log('Bank Admin already loaded, skipping fetch.');
    return;
  }

  // 4️⃣ Fetch bank admin details from backend
  this.loading = true;
  this.http.get<BankAdmin>(`${this.apiUrl}/bank-admins/by-username/${storedUsername}`)
    .subscribe({
      next: (admin) => {
        if (!admin) {
          console.error('Bank Admin not found in backend');
          this.showMessage('Bank Admin not found', 'error');
          localStorage.clear(); // clear to avoid repeated redirects
          this.router.navigate(['/bank-admin/login']);
          return;
        }

        // ✅ Save bank admin locally
        this.bankAdmin = admin;
        console.log('Bank Admin loaded:', admin);

        // 5️⃣ Load dashboard and related data
        this.loadDashboardData();
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to fetch Bank Admin details', err);
        this.showMessage('Failed to load bank admin data', 'error');
        localStorage.clear(); // clear to avoid repeated redirects
        this.router.navigate(['/bank-admin/login']);
        this.loading = false;
      }
    });
}



  loadDashboardData(): void {
    if (!this.bankAdmin) return;

    this.http.get<any>(
      `${this.apiUrl}/bank-admins/bank-admin/${this.bankAdmin.bankAdminId}/dashboard`
    ).subscribe({
      next: (data) => {
        console.log('📊 Dashboard Data:', data);
        this.dashboardStats = data;
      },
      error: (err) => {
        console.error('Failed to load dashboard stats', err);
      }
    });

    this.loadPendingOrganizations();
    this.loadAllOrganizations();
    this.loadPendingEmployees();
    this.loadPendingDisbursements();
    this.loadBankAdminConcerns();
    this.loadPendingVendorPayments();
    this.loadPendingVendorAccounts();
  }

  // ==================== ORGANIZATION MANAGEMENT ====================

  loadPendingOrganizations(): void {
    if (!this.bankAdmin) return;

    this.loading = true;
    this.http.get<Organization[]>(
      `${this.apiUrl}/organizations/pending/${this.bankAdmin.bankAdminId}`
    ).subscribe({
      next: (data) => {
        this.pendingOrganizations = data;
        this.loading = false;
      },
      error: () => {
        this.showMessage('Failed to load pending organizations', 'error');
        this.loading = false;
      }
    });
  }

  loadAllOrganizations(): void {
    if (!this.bankAdmin) return;

    this.http.get<Organization[]>(
      `${this.apiUrl}/organizations/assigned/${this.bankAdmin.bankAdminId}`
    ).subscribe({
      next: (data) => {
        this.allOrganizations = data;
      },
      error: (err) => {
        console.error('Failed to load organizations', err);
      }
    });
  }

  onFileSelect(event: any): void {
    if (event.target.files.length > 0) {
      this.organizationForm.document = event.target.files[0];
    }
  }

  addOrganization(): void {
  if (!this.bankAdmin) return;

  if (!this.organizationForm.name ||
      !this.organizationForm.officialEmail ||
      !this.organizationForm.registrationNumber ||
      !this.organizationForm.document) {
    this.showMessage('Please fill all required fields', 'error');
    return;
  }

  this.loading = true;
  const formData = new FormData();

  const orgData = {
    name: this.organizationForm.name,
    officialEmail: this.organizationForm.officialEmail,
    contactNumber: this.organizationForm.contactNumber,
    address: this.organizationForm.address,
    registrationNumber: this.organizationForm.registrationNumber
  };

  formData.append('data', JSON.stringify(orgData));
  formData.append('document', this.organizationForm.document!);

  this.http.post(
    `${this.apiUrl}/organizations/register/${this.bankAdmin.bankAdminId}`,
    formData
  ).subscribe({
    next: () => {
      this.showMessage('Organization registered successfully', 'success');
      this.resetOrgForm();
      this.loadPendingOrganizations();
      this.loadAllOrganizations();
      this.loading = false;
    },
    error: (err) => {
      this.showMessage(err.error?.message || 'Failed to register organization', 'error');
      this.loading = false;
    }
  });
}


  approveOrganization(orgId: number): void {
    if (!this.bankAdmin || !confirm('Approve this organization?')) return;

    this.loading = true;
    this.http.put(
      `${this.apiUrl}/organizations/approve/${this.bankAdmin.bankAdminId}/${orgId}`,
      {},
        
      
      { responseType: 'text' as 'json' }   // ✅ add this line

    ).subscribe({
      next: () => {
        this.showMessage('Organization approved successfully', 'success');
        this.loadPendingOrganizations();
        this.loadAllOrganizations();
        this.loading = false;
      },
      error: () => {
        this.showMessage('Failed to approve organization', 'error');
        this.loading = false;
      }
    });
  }

  rejectOrganization(orgId: number): void {
    if (!this.bankAdmin) return;

    const reason = prompt('Enter rejection reason:');
    if (!reason) return;

    this.loading = true;
    this.http.put(
      `${this.apiUrl}/organizations/reject/${this.bankAdmin.bankAdminId}/${orgId}`,
      reason,
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    ).subscribe({
      next: () => {
        this.showMessage('Organization rejected', 'success');
        this.loadPendingOrganizations();
        this.loadAllOrganizations();
        this.loading = false;
      },
      error: () => {
        this.showMessage('Failed to reject organization', 'error');
        this.loading = false;
      }
    });
  }

  resetOrgForm(): void {
    this.organizationForm = {
      name: '',
      officialEmail: '',
      contactNumber: '',
      address: '',
      registrationNumber: '',
      document: null
    };
    this.showOrgForm = false;
  }

  // ==================== EMPLOYEE MANAGEMENT ====================

  loadPendingEmployees(): void {
    if (!this.bankAdmin) return;

    this.http.get<Employee[]>(
      `${this.apiUrl}/payroll/bank-admin/${this.bankAdmin.bankAdminId}/pending-employees`
    ).subscribe({
      next: (data) => {
        this.pendingEmployees = data;
      },
      error: (err) => {
        console.error('Failed to load pending employees', err);
      }
    });
  }

  reviewEmployee(empId: number, approve: boolean): void {
    if (!this.bankAdmin) return;

    let reason = '';
    if (!approve) {
      reason = prompt('Enter rejection reason:') || '';
      if (!reason) return;
    } else if (!confirm('Approve this employee?')) {
      return;
    }

    this.loading = true;
    this.http.post(
      `${this.apiUrl}/payroll/bank-admin/${this.bankAdmin.bankAdminId}/review-employee/${empId}?approve=${approve}&reason=${encodeURIComponent(reason)}`,
      {}
    ).subscribe({
      next: (response: any) => {
        this.showMessage(response.message || 'Employee reviewed successfully', 'success');
        this.loadPendingEmployees();
        this.loading = false;
      },
      error: () => {
        this.showMessage('Failed to review employee', 'error');
        this.loading = false;
      }
    });
  }

  // ==================== DISBURSEMENT MANAGEMENT ====================

  loadPendingDisbursements(): void {
    if (!this.bankAdmin) return;

    this.http.get<DisbursementRequest[]>(
      `${this.apiUrl}/payroll/disbursements/pending/${this.bankAdmin.bankAdminId}`
    ).subscribe({
      next: (data) => {
        this.pendingDisbursements = data;
      },
      error: (err) => {
        console.error('Failed to load pending disbursements', err);
      }
    });
  }

  approveDisbursement(requestId: number): void {
    if (!this.bankAdmin || !confirm('Approve this salary disbursement?')) return;

    this.loading = true;
    this.http.post(
      `${this.apiUrl}/payroll/bank-admin/${this.bankAdmin.bankAdminId}/approve-disbursement/${requestId}`,
      {}
    ).subscribe({
      next: (response: any) => {
        this.showMessage(response.message || 'Disbursement approved successfully', 'success');
        this.loadPendingDisbursements();
        this.loading = false;
      },
      error: (err) => {
        this.showMessage(err.error?.message || 'Failed to approve disbursement', 'error');
        this.loading = false;
      }
    });
  }

  // ==================== CONCERN MANAGEMENT ====================

  loadBankAdminConcerns(): void {
    if (!this.bankAdmin) return;

    this.http.get<Concern[]>(
      `${this.apiUrl}/concerns/bank-admin/${this.bankAdmin.bankAdminId}`
    ).subscribe({
      next: (data) => {
        this.bankAdminConcerns = data;
        this.dashboardStats.pendingConcerns = data.filter(c => 
          c.status === 'OPEN' || c.status === 'VERIFIED_BY_ORG'
        ).length;
      },
      error: (err) => {
        console.error('Failed to load concerns', err);
      }
    });
  }

  openConcernReplyModal(concern: Concern): void {
    this.selectedConcern = concern;
    this.concernReplyForm = {
      concernId: concern.concernId,
      replyMessage: '',
      replyBy: 'BANK_ADMIN',
      newStatus: 'RESOLVED'
    };
    this.showConcernReplyModal = true;
  }

  closeConcernReplyModal(): void {
    this.showConcernReplyModal = false;
    this.selectedConcern = null;
    this.concernReplyForm = {
      concernId: 0,
      replyMessage: '',
      replyBy: 'BANK_ADMIN',
      newStatus: 'RESOLVED'
    };
  }

  replyToConcern(): void {
    if (!this.concernReplyForm.replyMessage.trim()) {
      this.showMessage('Please enter a reply message', 'error');
      return;
    }

    this.loading = true;
    this.http.post(
      `${this.apiUrl}/concerns/reply`,
      this.concernReplyForm
    ).subscribe({
      next: () => {
        this.showMessage('Reply sent successfully', 'success');
        this.closeConcernReplyModal();
        this.loadBankAdminConcerns();
        this.loading = false;
      },
      error: (err) => {
        this.showMessage(err.error?.message || 'Failed to send reply', 'error');
        this.loading = false;
      }
    });
  }

  getConcernPriorityClass(priority: string): string {
    const priorityMap: {[key: string]: string} = {
      'HIGH': 'priority-high',
      'MEDIUM': 'priority-medium',
      'LOW': 'priority-low'
    };
    return priorityMap[priority] || 'priority-medium';
  }

  getConcernStatusClass(status: string): string {
    const statusMap: {[key: string]: string} = {
      'OPEN': 'badge-warning',
      'VERIFIED_BY_ORG': 'badge-info',
      'RESOLVED': 'badge-success',
      'CLOSED': 'badge-secondary'
    };
    return statusMap[status] || 'badge-secondary';
  }

  // ==================== VENDOR PAYMENT MANAGEMENT ====================

  loadPendingVendorPayments(): void {
    if (!this.bankAdmin) return;

    // Load all vendor payments for organizations under this bank admin
    this.allOrganizations.forEach(org => {
      this.http.get<VendorPayment[]>(
        `${this.apiUrl}/vendors/payments/${org.organizationId}`
      ).subscribe({
        next: (data) => {
          const pending = data.filter(p => p.status === 'PENDING');
          this.pendingVendorPayments = [...this.pendingVendorPayments, ...pending];
          this.allVendorPayments = [...this.allVendorPayments, ...data];
          this.dashboardStats.pendingVendorPayments = this.pendingVendorPayments.length;
        },
        error: (err) => {
          console.error('Failed to load vendor payments', err);
        }
      });
    });
  }

  loadPendingVendorAccounts(): void {
    if (!this.bankAdmin) return;

    // Note: You'll need to add this endpoint in your backend
    this.http.get<VendorBankAccount[]>(
      `${this.apiUrl}/vendors/bank-accounts/pending/${this.bankAdmin.bankAdminId}`
    ).subscribe({
      next: (data) => {
        this.pendingVendorAccounts = data;
      },
      error: (err) => {
        console.error('Failed to load pending vendor accounts', err);
      }
    });
  }

  approveVendorPayment(paymentId: number, orgId: number): void {
    if (!confirm('Approve this vendor payment?')) return;

    this.loading = true;
    this.http.post(
      `${this.apiUrl}/vendors/payments/approve/${orgId}/${paymentId}`,
      {}
    ).subscribe({
      next: (response: any) => {
        this.showMessage('Vendor payment approved successfully', 'success');
        this.pendingVendorPayments = [];
        this.allVendorPayments = [];
        this.loadPendingVendorPayments();
        this.loading = false;
      },
      error: (err) => {
        this.showMessage(err.error?.message || 'Failed to approve payment', 'error');
        this.loading = false;
      }
    });
  }

  approveVendorAccount(accountId: number): void {
    if (!this.bankAdmin || !confirm('Approve this vendor bank account?')) return;

    this.loading = true;
    this.http.post(
      `${this.apiUrl}/vendors/bank-accounts/approve/${this.bankAdmin.bankAdminId}/${accountId}`,
      {}
    ).subscribe({
      next: () => {
        this.showMessage('Vendor account approved successfully', 'success');
        this.loadPendingVendorAccounts();
        this.loading = false;
      },
      error: (err) => {
        this.showMessage(err.error?.message || 'Failed to approve account', 'error');
        this.loading = false;
      }
    });
  }

  rejectVendorAccount(accountId: number): void {
    if (!this.bankAdmin) return;

    const reason = prompt('Enter rejection reason:');
    if (!reason) return;

    this.loading = true;
    this.http.put(
      `${this.apiUrl}/vendors/bank-accounts/reject/${this.bankAdmin.bankAdminId}/${accountId}`,
      { reason },
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    ).subscribe({
      next: () => {
        this.showMessage('Vendor account rejected', 'success');
        this.loadPendingVendorAccounts();
        this.loading = false;
      },
      error: () => {
        this.showMessage('Failed to reject account', 'error');
        this.loading = false;
      }
    });
  }

  // ==================== UTILITIES ====================

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  showMessage(msg: string, type: 'success' | 'error' | 'info'): void {
    this.message = msg;
    this.messageType = type;
    setTimeout(() => {
      this.message = '';
    }, 5000);
  }

logout(): void {
  localStorage.removeItem('username');
  localStorage.removeItem('email');
  localStorage.removeItem('role');
  localStorage.removeItem('token');
  this.router.navigate(['/bank-admin/login']);
}

}