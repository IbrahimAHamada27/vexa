export type PatientGender = 'male' | 'female' | 'other';

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  gender?: PatientGender;
  notes?: string;
}
