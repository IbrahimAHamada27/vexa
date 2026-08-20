import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { DoctorQuery } from '../validators/schemas.js';
import { Prisma } from '@prisma/client';

/**
 * GET /api/v1/doctors
 * List all doctors with optional filters: specialty, organizationId, search
 */
export async function listDoctors(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { specialty, organizationId, search } = req.query as unknown as DoctorQuery;

    const where: Prisma.DoctorWhereInput = {};

    if (specialty) {
      where.specialty = { contains: specialty };
    }

    if (organizationId) {
      where.organizationId = organizationId;
    }

    if (search) {
      where.OR = [
        { fullName: { contains: search } },
        { specialty: { contains: search } },
        { bio: { contains: search } },
      ];
    }

    const doctors = await prisma.doctor.findMany({
      where,
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            type: true,
            city: true,
          },
        },
      },
      orderBy: { fullName: 'asc' },
    });

    sendSuccess(res, doctors, `Found ${doctors.length} doctor(s)`);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/doctors/:id
 * Get doctor by ID with organization info and availability
 */
export async function getDoctorById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = req.params['id'] as string;

    const doctor = await prisma.doctor.findUnique({
      where: { id },
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            type: true,
            city: true,
            address: true,
            phone: true,
          },
        },
        availabilitySlots: {
          orderBy: [{ date: 'asc' }, { time: 'asc' }],
        },
        researches: {
          orderBy: { publicationDate: 'desc' },
        },
        conferences: {
          orderBy: { date: 'desc' },
        },
      },
    });

    if (!doctor) {
      sendError(res, 'Doctor not found', 404);
      return;
    }

    sendSuccess(res, doctor, 'Doctor retrieved successfully');
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/doctors/:id/availability
 * Get doctor availability slots directly by doctor ID
 */
export async function getDoctorAvailability(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = req.params['id'] as string;
    const dateParam = typeof req.query['date'] === 'string' ? req.query['date'] : undefined;

    const where: Prisma.AvailabilitySlotWhereInput = { doctorId: id };
    if (dateParam) {
      where.date = dateParam;
    }

    const slots = await prisma.availabilitySlot.findMany({
      where,
      orderBy: [{ date: 'asc' }, { time: 'asc' }],
    });

    sendSuccess(res, slots, `Found ${slots.length} availability slot(s)`);
  } catch (error) {
    next(error);
  }
}
