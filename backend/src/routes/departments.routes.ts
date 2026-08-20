import { Router } from 'express';
import { listDepartments } from '../controllers/departments.controller.js';
import { validate } from '../middleware/validate.js';
import { departmentQuerySchema } from '../validators/schemas.js';

export const departmentsRouter = Router();

/**
 * @swagger
 * /api/v1/departments:
 *   get:
 *     summary: List all departments
 *     tags: [Departments]
 *     parameters:
 *       - in: query
 *         name: organizationId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by organization
 *     responses:
 *       200:
 *         description: List of departments with medical services
 */
departmentsRouter.get(
  '/',
  validate(departmentQuerySchema, 'query'),
  listDepartments
);
