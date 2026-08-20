import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { Appointment, CreateAppointmentRequest } from '../models/appointment.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.appointments}`;

  createAppointment(request: CreateAppointmentRequest): Observable<ApiResponse<Appointment>> {
    return this.http.post<ApiResponse<Appointment>>(this.baseUrl, request);
  }

  getAppointments(): Observable<ApiResponse<Appointment[]>> {
    return this.http.get<ApiResponse<Appointment[]>>(this.baseUrl);
  }

  getAppointmentById(id: string): Observable<ApiResponse<Appointment>> {
    return this.http.get<ApiResponse<Appointment>>(`${this.baseUrl}/${id}`);
  }
}
