export interface MedicalService {
  id: string;
  organizationId: string;
  departmentId?: string;
  name: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  durationMinutes: number;
}
