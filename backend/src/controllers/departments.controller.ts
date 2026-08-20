import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma.js';
import { sendSuccess } from '../utils/response.js';
import { DepartmentQuery } from '../validators/schemas.js';
import { Prisma } from '@prisma/client';

/**
 * GET /api/v1/departments
 * List departments, optionally filtered by organizationId
 */
export async function listDepartments(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { organizationId } = req.query as unknown as DepartmentQuery;

    const where: Prisma.DepartmentWhereInput = {};

    if (organizationId) {
      where.organizationId = organizationId;
    }

    const departments = await prisma.department.findMany({
      where,
      include: {
        organization: {
          select: {
            id: true,
            name: true,
          },
        },
        medicalServices: true,
        _count: {
          select: { medicalServices: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    sendSuccess(res, departments, `Found ${departments.length} department(s)`);
  } catch (error) {
    next(error);
  }
}
