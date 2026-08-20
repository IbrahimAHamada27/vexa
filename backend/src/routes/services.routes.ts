import { Router } from 'express';
import { listServices } from '../controllers/services.controller.js';
import { validate } from '../middleware/validate.js';
import { serviceQuerySchema } from '../validators/schemas.js';

export const servicesRouter = Router();

/**
 * @swagger
 * /api/v1/services:
 *   get:
 *     summary: List all medical services
 *     tags: [Services]
 *     parameters:
 *       - in: query
 *         name: organizationId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by organization
 *       - in: query
 *         name: departmentId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by department
 *     responses:
 *       200:
 *         description: List of medical services
 */
servicesRouter.get(
  '/',
  validate(serviceQuerySchema, 'query'),
  listServices
);
