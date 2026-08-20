export type OrganizationType = 'hospital' | 'clinic' | 'medical_center' | 'research_institute';

export interface Organization {
  id: string;
  name: string;
  type: OrganizationType;
  description: string;
  logoUrl?: string;
  imageUrl?: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  website?: string;
  rating: number;
  reviewCount: number;
  departmentsCount?: number;
  doctorsCount?: number;
  servicesCount?: number;
  isVerified: boolean;
  createdAt: string;
}
