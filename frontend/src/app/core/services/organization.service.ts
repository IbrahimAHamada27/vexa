import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { Organization } from '../models/organization.model';
import { ApiResponse, PaginatedData } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.organizations}`;

  getOrganizations(city?: string, query?: string): Observable<ApiResponse<Organization[] | PaginatedData<Organization>>> {
    let params = new HttpParams();
    if (city) {
      params = params.set('city', city);
    }
    if (query) {
      params = params.set('query', query);
    }
    return this.http.get<ApiResponse<Organization[] | PaginatedData<Organization>>>(this.baseUrl, { params });
  }

  getOrganizationById(id: string): Observable<ApiResponse<Organization>> {
    return this.http.get<ApiResponse<Organization>>(`${this.baseUrl}/${id}`);
  }
}
