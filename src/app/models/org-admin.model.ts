// // src/app/models/org-admin.model.ts

// export interface OrgAdminLoginRequest {
//   email: string;
//   password: string;
// }

// export interface OrgAdminLoginResponse {
//   orgAdminId: number;
//   organizationId: number;
//   name: string;
//   email: string;
//   organizationName: string;
//   token?: string;
// }

// export interface Employee {
//   employeeId?: number;
//   name: string;
//   email: string;
//   phoneNumber: string;
//   designation: string;
//   department: string;
//   status: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED' | 'ACTIVE';
//   documentUrl?: string;
//   joiningDate?: Date;
//   organizationName?: string;
//   addedByName?: string;
// }

// export interface EmployeeFormData {
//   name: string;
//   email: string;
//   phoneNumber: string;
//   designation: string;
//   department: string;
//   document?: File;
// }

// export interface BankAccount {
//   bankAccountId?: number;
//   bankName: string;
//   branch: string;
//   ifscCode: string;
//   accountNumber: string;
//   balance?: number;
//   status: 'PENDING_APPROVAL' | 'APPROVED' | 'REJECTED';
//   isSameBank?: boolean;
// }

// export interface Salary {
//   salaryId?: number;
//   employeeId?: number;
//   employeeName?: string;
//   basicSalary: number;
//   hra: number;
//   allowances: number;
//   deductions: number;
//   netSalary: number;
//   salaryMonth?: Date;
//   disbursed?: boolean;
// }

// export interface SalarySummary {
//   employeeName: string;
//   netSalary: number;
//   salaryMonth: Date;
// }

// export interface DisbursementRequest {
//   requestId?: number;
//   month: string;
//   totalAmount: number;
//   status: 'PENDING' | 'COMPLETED' | 'REJECTED';
//   requestedAt?: Date;
//   approvedAt?: Date;
// }

// export interface Transaction {
//   transactionId: number;
//   employeeName: string;
//   debitAccount: string;
//   creditAccount: string;
//   amount: number;
//   description: string;
//   status: 'SUCCESS' | 'FAILED' | 'PENDING';
//   transactionDate: Date;
// }

// export interface PendingEmployee extends Employee {
//   organizationName: string;
//   documentUrl?: string;
// }




// src/app/models/org-admin.model.ts

export interface OrgAdminLoginRequest {
  email: string;
  password: string;
}

export interface OrgAdminLoginResponse {
  orgAdminId: number;
  name: string;
  email: string;
  organizationId: number;
  organizationName: string;
  designation: string;
}

export interface Employee {
  employeeId: number;
  name: string;
  email: string;
  phoneNumber: string;
  designation: string;
  department: string;
  status: string;
  documentUrl?: string;
  bankAccount?: BankAccount;
}

export interface PendingEmployee {
  employeeId: number;
  name: string;
  email: string;
  phoneNumber: string;
  designation: string;
  department: string;
  documentUrl?: string;
}

export interface BankAccount {
  accountId: number;
  bankName: string;
  branch: string;
  ifscCode: string;
  accountNumber: string;
  balance: number;
  status: string;
}

export interface Salary {
  salaryId: number;
  basicSalary: number;
  hra: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  salaryMonth: string;
  disbursed: boolean;
}

export interface SalarySummary {
  salaryId: number;
  employeeName: string;
  netSalary: number;
  salaryMonth: string;
}

export interface DisbursementRequest {
  requestId: number;
  month: string;
  totalAmount: number;
  status: string;
  requestedAt: string;
}

export interface Transaction {
  transactionId: number;
  employeeName: string;
  debitAccount: string;
  creditAccount: string;
  amount: number;
  description: string;
  status: string;
  transactionDate: string;
}

export interface EmployeeFormData {
  name: string;
  email: string;
  phoneNumber: string;
  designation: string;
  department: string;
  document?: File;
}

// Vendor Models
export interface Vendor {
  vendorId: number;
  vendorName: string;
  email: string;
  phoneNumber: string;
  address: string;
  gstNumber: string;
  panNumber: string;
  status: string;
  bankAccount?: VendorBankAccount;
}

export interface VendorBankAccount {
  accountId: number;
  bankName: string;
  branch: string;
  ifscCode: string;
  accountNumber: string;
  balance: number;
  status: string;
}

export interface VendorPayment {
  paymentId: number;
  vendorName: string;
  amount: number;
  paymentPurpose: string;
  paymentMode: string;
  status: string;
  transactionId?: string;
  approvedAt?: string;
}

export interface VendorTransaction {
  transactionId: number;
  vendorName: string;
  debitAccount: string;
  creditAccount: string;
  amount: number;
  status: string;
  description: string;
  transactionDate: string;
}

// Concern Models
export interface Concern {
  concernId: number;
  employeeName?: string;
  organizationAdminName?: string;
  subject: string;
  description: string;
  priority: string;
  status: string;
  documentUrl?: string;
  raisedBy: string;
  raisedAt: string;
  reply?: string;
  repliedBy?: string;
  repliedAt?: string;
}