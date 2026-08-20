import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { AvailabilityQuery, CreateAppointmentInput } from '../validators/schemas.js';

/**
 * GET /api/v1/appointments/availability
 * Returns time slots for a doctor on a specific date.
 * Marks slots with existing Confirmed/Pending appointments as unavailable.
 */
export async function getAvailability(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { doctorId, date } = req.query as unknown as AvailabilityQuery;

    // Verify doctor exists
    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId },
      select: { id: true, fullName: true },
    });

    if (!doctor) {
      sendError(res, 'Doctor not found', 404);
      return;
    }

    // Get all availability slots for this doctor on this date
    const slots = await prisma.availabilitySlot.findMany({
      where: { doctorId, date },
      orderBy: { time: 'asc' },
    });

    // Get existing confirmed/pending appointments for this doctor on this date
    const bookedAppointments = await prisma.appointment.findMany({
      where: {
        doctorId,
        date,
        status: { in: ['Confirmed', 'Pending'] },
      },
      select: { time: true },
    });

    const bookedTimes = new Set(bookedAppointments.map((a) => a.time));

    // Merge: if a slot's time is booked, mark it unavailable
    const availability = slots.map((slot) => ({
      id: slot.id,
      time: slot.time,
      isAvailable: slot.isAvailable && !bookedTimes.has(slot.time),
    }));

    sendSuccess(
      res,
      {
        doctorId,
        doctorName: doctor.fullName,
        date,
        slots: availability,
        totalSlots: availability.length,
        availableSlots: availability.filter((s) => s.isAvailable).length,
      },
      'Availability retrieved successfully'
    );
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/v1/appointments
 * Book a new appointment with duplicate protection.
 */
export async function createAppointment(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const input = req.body as CreateAppointmentInput;

    // 1. Verify organization exists
    const organization = await prisma.organization.findUnique({
      where: { id: input.organizationId },
      select: { id: true, name: true },
    });

    if (!organization) {
      sendError(res, 'Organization not found', 404);
      return;
    }

    // 2. Verify doctor exists and belongs to the organization
    const doctor = await prisma.doctor.findUnique({
      where: { id: input.doctorId },
      select: { id: true, fullName: true, organizationId: true },
    });

    if (!doctor) {
      sendError(res, 'Doctor not found', 404);
      return;
    }

    if (doctor.organizationId !== input.organizationId) {
      sendError(
        res,
        `Dr. ${doctor.fullName} does not belong to the specified organization`,
        400
      );
      return;
    }

    // 3. Check for duplicate: existing Confirmed/Pending appointment for same doctor+date+time
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        doctorId: input.doctorId,
        date: input.date,
        time: input.time,
        status: { in: ['Confirmed', 'Pending'] },
      },
    });

    if (existingAppointment) {
      sendError(res, 'This appointment slot is already booked.', 409);
      return;
    }

    // 4. Check if the availability slot exists and is available
    const slot = await prisma.availabilitySlot.findFirst({
      where: {
        doctorId: input.doctorId,
        date: input.date,
        time: input.time,
      },
    });

    if (slot && !slot.isAvailable) {
      sendError(res, 'This time slot is not available for booking.', 400);
      return;
    }

    // 5. Create the appointment and mark the slot as unavailable (transaction)
    const appointment = await prisma.$transaction(async (tx) => {
      // Create appointment
      const newAppointment = await tx.appointment.create({
        data: {
          organizationId: input.organizationId,
          doctorId: input.doctorId,
          patientName: input.patientName,
          patientPhone: input.patientPhone,
          patientEmail: input.patientEmail || null,
          date: input.date,
          time: input.time,
          status: 'Pending',
          notes: input.notes || null,
        },
        include: {
          doctor: {
            select: { fullName: true, specialty: true },
          },
          organization: {
            select: { name: true },
          },
        },
      });

      // Mark availability slot as unavailable (if it exists)
      if (slot) {
        await tx.availabilitySlot.update({
          where: { id: slot.id },
          data: { isAvailable: false },
        });
      }

      return newAppointment;
    });

    sendSuccess(res, appointment, 'Appointment booked successfully', 201);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/appointments
 * List appointments with optional filters
 */
export async function listAppointments(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { doctorId, organizationId, status, date } = req.query as Record<string, string | undefined>;

    const where: Record<string, unknown> = {};
    if (doctorId) where['doctorId'] = doctorId;
    if (organizationId) where['organizationId'] = organizationId;
    if (status) where['status'] = status;
    if (date) where['date'] = date;

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        doctor: {
          select: { fullName: true, specialty: true, imageUrl: true },
        },
        organization: {
          select: { name: true, city: true },
        },
      },
      orderBy: [{ date: 'asc' }, { time: 'asc' }],
    });

    sendSuccess(res, appointments, `Found ${appointments.length} appointment(s)`);
  } catch (error) {
    next(error);
  }
}
