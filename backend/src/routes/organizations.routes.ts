import { Router } from 'express';
import { listOrganizations, getOrganizationById } from '../controllers/organizations.controller.js';
import { validate } from '../middleware/validate.js';
import { organizationQuerySchema, idParamSchema } from '../validators/schemas.js';

export const organizationsRouter = Router();

/**
 * @swagger
 * /api/v1/organizations:
 *   get:
 *     summary: List all organizations
 *     tags: [Organizations]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [Clinic, MedicalCenter, Hospital]
 *         description: Filter by organization type
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: Filter by city (partial match)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in name and description
 *     responses:
 *       200:
 *         description: List of organizations
 */
organizationsRouter.get(
  '/',
  validate(organizationQuerySchema, 'query'),
  listOrganizations
);

/**
 * @swagger
 * /api/v1/organizations/{id}:
 *   get:
 *     summary: Get organization by ID
 *     tags: [Organizations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Organization UUID
 *     responses:
 *       200:
 *         description: Organization with departments, doctors, services, research, conferences
 *       404:
 *         description: Organization not found
 */
organizationsRouter.get(
  '/:id',
  validate(idParamSchema, 'params'),
  getOrganizationById
);
