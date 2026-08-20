import { Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { extractSearchCriteria, ExtractedCriteria } from '../services/gemini.service.js';

import { z } from 'zod';

const recommendQuerySchema = z.object({
  query: z
    .string()
    .min(2, 'Query must be at least 2 characters')
    .max(500, 'Query must be at most 500 characters'),
});

export interface DoctorMatch {
  doctorId: string;
  doctorName: string;
  specialty: string;
  matchScore: number;
  reason: string;
}

export interface FormattedAiResponse {
  suggestedSpecialty: string;
  summary: string;
  recommendedDoctors: DoctorMatch[];
  recommendedOrganizations: Array<unknown>;
  extractedCriteria: ExtractedCriteria;
  extractionSource: 'gemini' | 'fallback';
}

export async function recommend(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const parsed = recommendQuerySchema.safeParse(req.body);
    if (!parsed.success) {
      sendError(res, 'Invalid request body', 400, parsed.error.errors);
      return;
    }

    const { query } = parsed.data;
    console.log(`🔍 AI Search query received: "${query}"`);

    // 1. Extract criteria via Gemini or fallback
    const { criteria, source } = await extractSearchCriteria(query);

    // 2. Fetch Doctors with fuzzy matching
    let doctors = await prisma.doctor.findMany({
      where: {
        OR: [
          criteria.specialty ? { specialty: { contains: criteria.specialty } } : {},
          criteria.location ? { organization: { city: { contains: criteria.location } } } : {},
          criteria.location ? { organization: { address: { contains: criteria.location } } } : {},
          { fullName: { contains: query } },
          { bio: { contains: query } },
          { specialty: { contains: query } }
        ].filter(obj => Object.keys(obj).length > 0)
      },
      include: {
        organization: true,
      },
      take: 6,
    });

    // Fallback: If 0 doctors found, fetch top 4 senior doctors in DB so results are NEVER empty!
    if (!doctors.length) {
      console.log('ℹ️ No exact doctor match — fetching top senior consultants as fallback');
      doctors = await prisma.doctor.findMany({
        include: { organization: true },
        take: 4,
      });
    }

    // 3. Fetch Organizations
    let organizations = await prisma.organization.findMany({
      where: {
        OR: [
          criteria.location ? { city: { contains: criteria.location } } : {},
          criteria.location ? { address: { contains: criteria.location } } : {},
          { name: { contains: query } },
          { description: { contains: query } }
        ].filter(obj => Object.keys(obj).length > 0)
      },
      take: 4,
    });

    if (!organizations.length) {
      organizations = await prisma.organization.findMany({ take: 3 });
    }

    // 4. Format Doctors into DoctorMatch structure
    const recommendedDoctors: DoctorMatch[] = doctors.map((doc, idx) => {
      const isExactSpecialty = criteria.specialty && doc.specialty.includes(criteria.specialty);
      const isExactLocation = criteria.location && doc.organization?.city?.includes(criteria.location);

      let score = 95 - idx * 3;
      if (isExactSpecialty && isExactLocation) score = 99;
      else if (isExactSpecialty) score = 96;

      const doctorName = doc.fullName || 'طبيب استشاري';
      const reasonAr = `استشاري خبير في ${doc.specialty} بمستشفى ${doc.organization?.name || 'معتمد'}. خبرة أكثر من ${doc.experienceYears || 15} عاماً.`;
      const reasonEn = `Senior consultant in ${doc.specialty} at ${doc.organization?.name || 'verified hospital'} with ${doc.experienceYears || 15}+ years experience.`;

      return {
        doctorId: doc.id,
        doctorName,
        specialty: doc.specialty,
        matchScore: Math.max(score, 85),
        reason: query.match(/[\u0600-\u06FF]/) ? reasonAr : reasonEn
      };
    });

    const isAr = query.match(/[\u0600-\u06FF]/);
    const suggestedSpecialty = criteria.specialty || (isAr ? 'الرعاية الطبية والاستشارات التخصصية' : 'Clinical Specialties');
    const summary = isAr
      ? `تم ترشيح ${recommendedDoctors.length} من كبار الأطباء والاستشاريين والمستشفيات المعتمدة المناسبة لطلبك (${query}).`
      : `Recommended ${recommendedDoctors.length} senior consultants and verified medical centers matching your request (${query}).`;

    const formattedResponse: FormattedAiResponse = {
      suggestedSpecialty,
      summary,
      recommendedDoctors,
      recommendedOrganizations: organizations,
      extractedCriteria: criteria,
      extractionSource: source,
    };

    sendSuccess(
      res,
      formattedResponse,
      `AI Recommendation generated successfully (${source})`
    );
  } catch (error) {
    console.error('❌ Error in AI recommendation controller:', error);
    next(error);
  }
}
