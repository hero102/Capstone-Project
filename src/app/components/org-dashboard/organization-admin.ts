import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface OrganizationAdminRequestDto {
  name: string;
  email: string;
  phoneNumber: string;
  designation: string;
}

export interface OrganizationAdminResponseDto {
  organizationAdminId: number;
  name: string;
  email: string;
  phoneNumber: string;
  designation: string;
  status: string;
  organizationName: string;
  assignedBankAdmin?: string | null;
  documentUrl?: string | null;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class OrganizationAdminService {
  private BASE_URL = 'http://localhost:8080/api/organization-admins';
  private ORG_URL = 'http://localhost:8080/api/organizations';

  constructor(private http: HttpClient) {}

  /** Attach JWT token */
  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No JWT token found in localStorage');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  /** Get organization info by username */
  getOrganizationByUsername(username: string): Observable<{ organizationId: number }> {
    return this.http.get<{ organizationId: number }>(
      `${this.ORG_URL}/username/${username}`,
      { headers: this.getHeaders() }
    );
  }

  /** List all admins of an organization */
  listAdmins(organizationId: number): Observable<OrganizationAdminResponseDto[]> {
    return this.http.get<OrganizationAdminResponseDto[]>(
      `${this.BASE_URL}/${organizationId}`,
      { headers: this.getHeaders() }
    );
  }

  /** Create a new organization admin */
  createAdmin(
    organizationId: number,
    dto: OrganizationAdminRequestDto,
    document?: File
  ): Observable<OrganizationAdminResponseDto> {
    if (!organizationId) throw new Error('Organization ID is undefined');

    const formData = new FormData();
    formData.append('data', JSON.stringify(dto));
    if (document) formData.append('document', document);

    return this.http.post<OrganizationAdminResponseDto>(
      `${this.BASE_URL}/${organizationId}/create`,
      formData,
      { headers: this.getHeaders() }
    );
  }

  /** Deactivate an admin */
  deactivateAdmin(bankAdminId: number, orgAdminId: number, reason: string): Observable<string> {
    const headers = this.getHeaders().set('Content-Type', 'text/plain; charset=utf-8');
    return this.http.put(
      `${this.BASE_URL}/${bankAdminId}/deactivate/${orgAdminId}`,
      reason,
      { headers, responseType: 'text' }
    );
  }

  /** Reactivate an admin */
  reactivateAdmin(bankAdminId: number, orgAdminId: number): Observable<string> {
    return this.http.put(
      `${this.BASE_URL}/${bankAdminId}/reactivate/${orgAdminId}`,
      null,
      { headers: this.getHeaders(), responseType: 'text' }
    );
  }
}
