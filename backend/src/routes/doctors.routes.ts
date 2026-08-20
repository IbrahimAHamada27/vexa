import { Router } from 'express';
import { listDoctors, getDoctorById, getDoctorAvailability } from '../controllers/doctors.controller.js';
import { validate } from '../middleware/validate.js';
import { doctorQuerySchema, idParamSchema } from '../validators/schemas.js';

export const doctorsRouter = Router();

/**
 * @swagger
 * /api/v1/doctors:
 *   get:
 *     summary: List all doctors
 *     tags: [Doctors]
 *     parameters:
 *       - in: query
 *         name: specialty
 *         schema:
 *           type: string
 *         description: Filter by specialty (partial match)
 *       - in: query
 *         name: organizationId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by organization
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in name, specialty, and bio
 *     responses:
 *       200:
 *         description: List of doctors with organization info
 */
doctorsRouter.get(
  '/',
  validate(doctorQuerySchema, 'query'),
  listDoctors
);

/**
 * @swagger
 * /api/v1/doctors/{id}:
 *   get:
 *     summary: Get doctor by ID
 *     tags: [Doctors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Doctor UUID
 *     responses:
 *       200:
 *         description: Doctor with organization info and availability slots
 *       404:
 *         description: Doctor not found
 */
doctorsRouter.get(
  '/:id',
  validate(idParamSchema, 'params'),
  getDoctorById
);

/**
 * @swagger
 * /api/v1/doctors/{id}/availability:
 *   get:
 *     summary: Get doctor availability slots
 *     tags: [Doctors]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Doctor ID
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *         description: Optional date filter (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Doctor availability slots
 */
doctorsRouter.get(
  '/:id/availability',
  getDoctorAvailability
);
