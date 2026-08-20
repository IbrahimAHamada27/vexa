export interface Conference {
  id: string;
  organizationId?: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  isVirtual: boolean;
  registrationUrl?: string;
}
