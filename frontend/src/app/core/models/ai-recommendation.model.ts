import { Organization } from './organization.model';

export interface DoctorMatch {
  doctorId: string;
  doctorName: string;
  specialty: string;
  matchScore: number;
  reason: string;
}

export interface AiRecommendationRequest {
  query?: string;
  symptoms?: string;
  preferredCity?: string;
  preferredSpecialty?: string;
}

export interface AiRecommendationResponse {
  suggestedSpecialty: string;
  summary: string;
  recommendedDoctors: DoctorMatch[];
  recommendedOrganizations?: Organization[];
  extractedCriteria?: {
    specialty?: string;
    location?: string;
  };
}
