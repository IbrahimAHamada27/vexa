import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { Department } from '../models/department.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.departments}`;

  getDepartments(organizationId?: string): Observable<ApiResponse<Department[]>> {
    let params = new HttpParams();
    if (organizationId) {
      params = params.set('organizationId', organizationId);
    }
    return this.http.get<ApiResponse<Department[]>>(this.baseUrl, { params });
  }

  getDepartmentById(id: string): Observable<ApiResponse<Department>> {
    return this.http.get<ApiResponse<Department>>(`${this.baseUrl}/${id}`);
  }
}
