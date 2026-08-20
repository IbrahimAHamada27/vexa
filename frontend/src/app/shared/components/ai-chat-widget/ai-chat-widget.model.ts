import { AiRecommendationResponse } from '../../../core/models/ai-recommendation.model';

export interface EmergencyInfo {
  title: string;
  phone: string;
  description: string;
  type: 'ambulance' | 'pharmacy' | 'lab' | 'fire' | 'poison';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  recommendation?: AiRecommendationResponse;
  emergencyInfo?: EmergencyInfo[];
}
