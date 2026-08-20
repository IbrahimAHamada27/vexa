import { Patient } from './patient.model';

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface Appointment {
  id: string;
  patientId: string;
  patient?: Patient;
  doctorId: string;
  organizationId: string;
  serviceId?: string;
  slotId: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
}

export interface CreateAppointmentRequest {
  patient: Omit<Patient, 'id'>;
  doctorId: string;
  organizationId: string;
  serviceId?: string;
  slotId: string;
  appointmentDate: string;
  notes?: string;
}
