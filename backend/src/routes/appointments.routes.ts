import { Router } from 'express';
import {
  getAvailability,
  createAppointment,
  listAppointments,
} from '../controllers/appointments.controller.js';
import { validate } from '../middleware/validate.js';
import {
  availabilityQuerySchema,
  createAppointmentSchema,
} from '../validators/schemas.js';

export const appointmentsRouter = Router();

/**
 * @swagger
 * /api/v1/appointments/availability:
 *   get:
 *     summary: Check doctor availability for a specific date
 *     tags: [Availability]
 *     parameters:
 *       - in: query
 *         name: doctorId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Doctor UUID
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Date in YYYY-MM-DD format
 *     responses:
 *       200:
 *         description: Available time slots
 *       404:
 *         description: Doctor not found
 */
appointmentsRouter.get(
  '/availability',
  validate(availabilityQuerySchema, 'query'),
  getAvailability
);

/**
 * @swagger
 * /api/v1/appointments:
 *   get:
 *     summary: List all appointments
 *     tags: [Appointments]
 *     parameters:
 *       - in: query
 *         name: doctorId
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: organizationId
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Pending, Confirmed, Cancelled]
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: List of appointments
 */
appointmentsRouter.get('/', listAppointments);

/**
 * @swagger
 * /api/v1/appointments:
 *   post:
 *     summary: Book a new appointment
 *     tags: [Appointments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - organizationId
 *               - doctorId
 *               - patientName
 *               - patientPhone
 *               - date
 *               - time
 *             properties:
 *               organizationId:
 *                 type: string
 *                 format: uuid
 *               doctorId:
 *                 type: string
 *                 format: uuid
 *               patientName:
 *                 type: string
 *                 minLength: 2
 *               patientPhone:
 *                 type: string
 *                 minLength: 8
 *               patientEmail:
 *                 type: string
 *                 format: email
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2026-08-20"
 *               time:
 *                 type: string
 *                 example: "09:00"
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Appointment created successfully
 *       400:
 *         description: Validation error or slot unavailable
 *       404:
 *         description: Doctor or organization not found
 *       409:
 *         description: Appointment slot already booked
 */
appointmentsRouter.post(
  '/',
  validate(createAppointmentSchema, 'body'),
  createAppointment
);
