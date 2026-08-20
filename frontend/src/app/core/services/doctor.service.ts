import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { Doctor } from '../models/doctor.model';
import { AvailabilitySlot } from '../models/availability-slot.model';
import { ApiResponse, PaginatedData } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.doctors}`;

  getDoctors(organizationId?: string, specialty?: string): Observable<ApiResponse<PaginatedData<Doctor>>> {
    let params = new HttpParams();
    if (organizationId) {
      params = params.set('organizationId', organizationId);
    }
    if (specialty) {
      params = params.set('specialty', specialty);
    }
    return this.http.get<ApiResponse<PaginatedData<Doctor>>>(this.baseUrl, { params });
  }

  getDoctorById(id: string): Observable<ApiResponse<Doctor>> {
    return this.http.get<ApiResponse<Doctor>>(`${this.baseUrl}/${id}`);
  }

  getDoctorAvailability(doctorId: string, date?: string): Observable<ApiResponse<AvailabilitySlot[]>> {
    let params = new HttpParams();
    if (date) {
      params = params.set('date', date);
    }
    return this.http.get<ApiResponse<AvailabilitySlot[]>>(`${this.baseUrl}/${doctorId}/availability`, { params });
  }
}
