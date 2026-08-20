export interface Department {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  icon?: string;
  headDoctorId?: string;
  doctorsCount?: number;
  servicesCount?: number;
}
