import { z } from 'zod';

// ─── Organization Query Filters ─────────────────────────────────────────────

export const organizationQuerySchema = z.object({
  type: z
    .enum(['Clinic', 'MedicalCenter', 'Hospital'])
    .optional(),
  city: z.string().min(1).optional(),
  search: z.string().min(1).optional(),
});

export type OrganizationQuery = z.infer<typeof organizationQuerySchema>;

// ─── Doctor Query Filters ───────────────────────────────────────────────────

export const doctorQuerySchema = z.object({
  specialty: z.string().min(1).optional(),
  organizationId: z.string().uuid().optional(),
  search: z.string().min(1).optional(),
});

export type DoctorQuery = z.infer<typeof doctorQuerySchema>;

// ─── Department Query Filters ───────────────────────────────────────────────

export const departmentQuerySchema = z.object({
  organizationId: z.string().uuid().optional(),
});

export type DepartmentQuery = z.infer<typeof departmentQuerySchema>;

// ─── Service Query Filters ──────────────────────────────────────────────────

export const serviceQuerySchema = z.object({
  organizationId: z.string().uuid().optional(),
  departmentId: z.string().uuid().optional(),
});

export type ServiceQuery = z.infer<typeof serviceQuerySchema>;

// ─── Availability Query ─────────────────────────────────────────────────────

export const availabilityQuerySchema = z.object({
  doctorId: z.string().uuid('Invalid doctor ID format'),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
});

export type AvailabilityQuery = z.infer<typeof availabilityQuerySchema>;

// ─── Appointment Creation ───────────────────────────────────────────────────

export const createAppointmentSchema = z.object({
  organizationId: z.string().uuid('Invalid organization ID'),
  doctorId: z.string().uuid('Invalid doctor ID'),
  patientName: z
    .string()
    .min(2, 'Patient name must be at least 2 characters')
    .max(100),
  patientPhone: z
    .string()
    .min(8, 'Phone number must be at least 8 characters')
    .max(20),
  patientEmail: z
    .string()
    .email('Invalid email address')
    .optional()
    .or(z.literal('')),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  time: z
    .string()
    .regex(/^\d{2}:\d{2}$/, 'Time must be in HH:mm format'),
  notes: z.string().max(500).optional(),
});

export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;

// ─── ID Param ───────────────────────────────────────────────────────────────

export const idParamSchema = z.object({
  id: z.string().uuid('Invalid ID format'),
});
