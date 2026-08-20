import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { MedicalService } from '../models/service.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.services}`;

  getServices(organizationId?: string, departmentId?: string): Observable<ApiResponse<MedicalService[]>> {
    let params = new HttpParams();
    if (organizationId) {
      params = params.set('organizationId', organizationId);
    }
    if (departmentId) {
      params = params.set('departmentId', departmentId);
    }
    return this.http.get<ApiResponse<MedicalService[]>>(this.baseUrl, { params });
  }

  getServiceById(id: string): Observable<ApiResponse<MedicalService>> {
    return this.http.get<ApiResponse<MedicalService>>(`${this.baseUrl}/${id}`);
  }
}
