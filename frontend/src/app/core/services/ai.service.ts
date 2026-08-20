import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../config/api.config';
import { AiRecommendationRequest, AiRecommendationResponse } from '../models/ai-recommendation.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${API_CONFIG.baseUrl}${API_CONFIG.endpoints.aiRecommendations}`;

  recommend(query: string): Observable<ApiResponse<AiRecommendationResponse>> {
    return this.getDoctorRecommendations({ query, symptoms: query });
  }

  getDoctorRecommendations(request: AiRecommendationRequest): Observable<ApiResponse<AiRecommendationResponse>> {
    return this.http.post<ApiResponse<AiRecommendationResponse>>(this.baseUrl, request);
  }
}
