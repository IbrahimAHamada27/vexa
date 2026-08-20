import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { extractSearchCriteria, ExtractedCriteria } from '../services/gemini.service.js';
import { Prisma } from '@prisma/client';

// ─── Zod Validation ────────────────────────────────────────────────────────

import { z } from 'zod';

const recommendQuerySchema = z.object({
  query: z
    .string()
    .min(3, 'Query must be at least 3 characters')
    .max(500, 'Query must be at most 500 characters'),
});

// ─── Database Search ────────────────────────────────────────────────────────

interface RecommendationResult {
  extractedCriteria: ExtractedCriteria;
  extractionSource: 'gemini' | 'fallback';
  organizations: Awaited<ReturnType<typeof prisma.organization.findMany>>;
  doctors: Awaited<ReturnType<typeof prisma.doctor.findMany>>;
  departments: Awaited<ReturnType<typeof prisma.department.findMany>>;
}

async function searchDatabase(criteria: ExtractedCriteria): Promise<{
  organizations: Awaited<ReturnType<typeof prisma.organization.findMany>>;
  doctors: Awaited<ReturnType<typeof prisma.doctor.findMany>>;
  departments: Awaited<ReturnType<typeof prisma.department.findMany>>;
}> {
  // ── Build Organization query ────────────────────────────────────────────
  const orgWhere: Prisma.OrganizationWhereInput = {};
  const orgConditions: Prisma.OrganizationWhereInput[] = [];

  if (criteria.organizationType) {
    orgConditions.push({ type: criteria.organizationType });
  }

  if (criteria.location) {
    orgConditions.push({
      OR: [
        { city: { contains: criteria.location } },
        { address: { contains: criteria.location } },
      ],
    });
  }

  // Also search by keywords in organization name/description
  if (criteria.keywords.length > 0) {
    const keywordConditions: Prisma.OrganizationWhereInput[] = criteria.keywords.map((kw) => ({
      OR: [
        { name: { contains: kw } },
        { description: { contains: kw } },
      ],
    }));
    orgConditions.push({ OR: keywordConditions });
  }

  if (orgConditions.length > 0) {
    orgWhere.AND = orgConditions;
  }

  // ── Build Doctor query ──────────────────────────────────────────────────
  const doctorWhere: Prisma.DoctorWhereInput = {};
  const doctorConditions: Prisma.DoctorWhereInput[] = [];

  if (criteria.specialty) {
    doctorConditions.push({
      specialty: { contains: criteria.specialty },
    });
  }

  if (criteria.location) {
    doctorConditions.push({
      organization: {
        OR: [
          { city: { contains: criteria.location } },
          { address: { contains: criteria.location } },
        ],
      },
    });
  }

  if (criteria.organizationType) {
    doctorConditions.push({
      organization: {
        type: criteria.organizationType,
      },
    });
  }

  if (doctorConditions.length > 0) {
    doctorWhere.AND = doctorConditions;
  }

  // ── Build Department query ──────────────────────────────────────────────
  const deptWhere: Prisma.DepartmentWhereInput = {};
  const deptConditions: Prisma.DepartmentWhereInput[] = [];

  if (criteria.specialty) {
    deptConditions.push({
      OR: [
        { name: { contains: criteria.specialty } },
        { description: { contains: criteria.specialty } },
      ],
    });
  }

  if (criteria.location) {
    deptConditions.push({
      organization: {
        OR: [
          { city: { contains: criteria.location } },
          { address: { contains: criteria.location } },
        ],
      },
    });
  }

  if (deptConditions.length > 0) {
    deptWhere.AND = deptConditions;
  }

  // ── Execute queries in parallel ─────────────────────────────────────────
  const [organizations, doctors, departments] = await Promise.all([
    prisma.organization.findMany({
      where: orgWhere,
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
      take: 10,
    }),

    prisma.doctor.findMany({
      where: doctorWhere,
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            type: true,
            city: true,
            address: true,
          },
        },
        availabilitySlots: {
          where: { isAvailable: true },
          orderBy: [{ date: 'asc' }, { time: 'asc' }],
          take: 10,
        },
      },
      orderBy: { fullName: 'asc' },
      take: 10,
    }),

    prisma.department.findMany({
      where: deptWhere,
      include: {
        organization: {
          select: {
            id: true,
            name: true,
            city: true,
          },
        },
        medicalServices: true,
      },
      orderBy: { name: 'asc' },
      take: 10,
    }),
  ]);

  return { organizations, doctors, departments };
}

// ─── Controller ─────────────────────────────────────────────────────────────

/**
 * POST /api/v1/ai/recommend
 * Smart healthcare discovery — extracts search criteria via Gemini,
 * then queries the database for matching organizations, doctors, and departments.
 */
export async function recommend(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Validate request body
    const parsed = recommendQuerySchema.safeParse(req.body);
    if (!parsed.success) {
      sendError(res, 'Invalid request body', 400, parsed.error.errors);
      return;
    }

    const { query } = parsed.data;

    // 1. Extract search criteria (Gemini → fallback)
    const { criteria, source } = await extractSearchCriteria(query);

    // 2. Search the database with extracted criteria
    const { organizations, doctors, departments } = await searchDatabase(criteria);

    // 3. Build response
    const result: RecommendationResult = {
      extractedCriteria: criteria,
      extractionSource: source,
      organizations,
      doctors,
      departments,
    };

    const totalResults = organizations.length + doctors.length + departments.length;

    sendSuccess(
      res,
      result,
      totalResults > 0
        ? `Found ${totalResults} result(s): ${organizations.length} organization(s), ${doctors.length} doctor(s), ${departments.length} department(s).`
        : 'No matching results found. Try broadening your search.'
    );
  } catch (error) {
    next(error);
  }
}
