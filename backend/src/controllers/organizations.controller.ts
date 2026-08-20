import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { OrganizationQuery } from '../validators/schemas.js';
import { Prisma } from '@prisma/client';

/**
 * GET /api/v1/organizations
 * List all organizations with optional filters: type, city, search
 */
export async function listOrganizations(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { type, city, search } = req.query as unknown as OrganizationQuery;

    const where: Prisma.OrganizationWhereInput = {};

    if (type) {
      where.type = type;
    }

    if (city) {
      where.city = { contains: city };
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const organizations = await prisma.organization.findMany({
      where,
      include: {
        _count: {
          select: {
            departments: true,
            doctors: true,
            medicalServices: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    sendSuccess(res, organizations, `Found ${organizations.length} organization(s)`);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/organizations/:id
 * Get organization by ID with all related data
 */
export async function getOrganizationById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = req.params['id'] as string;

    const organization = await prisma.organization.findUnique({
      where: { id },
      include: {
        departments: {
          include: {
            medicalServices: true,
          },
        },
        doctors: {
          include: {
            availabilitySlots: {
              where: { isAvailable: true },
              orderBy: [{ date: 'asc' }, { time: 'asc' }],
              take: 20,
            },
          },
        },
        medicalServices: true,
        researches: {
          orderBy: { publicationDate: 'desc' },
        },
        conferences: {
          orderBy: { date: 'desc' },
        },
      },
    });

    if (!organization) {
      sendError(res, 'Organization not found', 404);
      return;
    }

    sendSuccess(res, organization, 'Organization retrieved successfully');
  } catch (error) {
    next(error);
  }
}
