import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.prod';
import { Organization } from '../models/organization.interface';

@Injectable({ providedIn: 'root' })
export class OrganizationService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/organizations`;

  getOrganizations() {
    return this.http.get<Organization[]>(this.apiUrl);
  }

  createOrganization(data: { name: string }) {
    return this.http.post<Organization>(this.apiUrl, data);
  }

  updateOrganization(id: string, data: { name: string }) {
    return this.http.put<Organization>(`${this.apiUrl}/${id}`, data);
  }
}
