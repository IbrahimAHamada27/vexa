import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma.js';
import { sendSuccess } from '../utils/response.js';
import { ServiceQuery } from '../validators/schemas.js';
import { Prisma } from '@prisma/client';

/**
 * GET /api/v1/services
 * List medical services, optionally filtered by organizationId or departmentId
 */
export async function listServices(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { organizationId, departmentId } = req.query as unknown as ServiceQuery;

    const where: Prisma.MedicalServiceWhereInput = {};

    if (organizationId) {
      where.organizationId = organizationId;
    }

    if (departmentId) {
      where.departmentId = departmentId;
    }

    const services = await prisma.medicalService.findMany({
      where,
      include: {
        department: {
          select: {
            id: true,
            name: true,
          },
        },
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    sendSuccess(res, services, `Found ${services.length} service(s)`);
  } catch (error) {
    next(error);
  }
}
