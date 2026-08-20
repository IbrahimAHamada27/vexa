export interface Doctor {
  id: string;
  organizationId: string;
  departmentId: string;
  name: string;
  title: string;
  specialty: string;
  bio: string;
  avatarUrl?: string;
  experienceYears: number;
  languages: string[];
  rating: number;
  reviewCount: number;
  consultationFee: number;
  currency: string;
  isAvailableForBooking: boolean;
}
