// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';

// @Injectable({ providedIn: 'root' })
// export class ConcernService {
//   private baseUrl = 'http://localhost:8080/api/concerns';

//   constructor(private http: HttpClient) {}

//   // Get all employee concerns
//   getEmployeeConcerns(empId: number): Observable<any> {
//     return this.http.get(`${this.baseUrl}/employee/${empId}`);
//   }

//   // Raise new concern
//   raiseConcern(data: any, file?: File): Observable<any> {
//     const formData = new FormData();
//     formData.append('data', JSON.stringify(data));
//     if (file) formData.append('document', file);
//     return this.http.post(`${this.baseUrl}/raise`, formData);
//   }

//   deleteConcern(concernId: number) {
//   //return this.http.delete(`${this.baseUrl}/concerns/${concernId}`);
//   return this.http.delete(`${this.baseUrl}/${concernId}`);

// }

// }


import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ConcernService {
  private baseUrl = 'http://localhost:8080/api/concerns';

  constructor(private http: HttpClient) {}

  getEmployeeConcerns(empId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/employee/${empId}`);
  }

  raiseConcern(formData: FormData): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/raise`, formData);
  }

  deleteConcern(concernId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${concernId}`);
  }
}
