/**
 * Gemini AI Service — Smart Multilingual Healthcare Search Criteria Extractor
 *
 * Responsibilities:
 * 1. Call Gemini API to extract structured search criteria from Arabic/English queries.
 * 2. Enforce strict guardrails: NO medical advice, diagnosis, or prescriptions.
 * 3. Provide robust bilingual regex/keyword fallback when Gemini is unavailable.
 */

export interface ExtractedCriteria {
  specialty: string | null;
  location: string | null;
  organizationType: string | null;
  keywords: string[];
}

interface GeminiResponse {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
      }>;
    };
  }>;
}

const SYSTEM_PROMPT = `You are a healthcare search criteria extractor for the VEXA Healthcare Platform in Egypt.
You support both Arabic and English user prompts.

ROLE: Extract structured search parameters from user queries. That is your ONLY function.

STRICT RULES:
- You MUST NEVER diagnose any condition.
- You MUST NEVER prescribe or recommend any medication.
- You MUST NEVER give medical advice of any kind.
- If the user asks for medical advice, set fields to appropriate general specialties and put keywords in keywords array.

TASK: Given a user's natural language query (in Arabic or English), extract:
1. "specialty" — standardized specialty in Arabic or English (e.g., "قلب" / "Cardiology", "جلدية" / "Dermatology", "أطفال" / "Pediatrics", "عظام" / "Orthopedics", "مخ وأعصاب" / "Neurosurgery").
2. "location" — city or district mentioned (e.g., "الشروق" / "El Shorouk", "القاهرة" / "Cairo", "التجمع" / "New Cairo", "الإسكندرية" / "Alexandria", "الجيزة" / "Giza").
3. "organizationType" — "hospital", "clinic", "medical_center", or null.
4. "keywords" — array of additional search terms.

OUTPUT FORMAT: Respond with ONLY valid JSON:
{"specialty": string | null, "location": string | null, "organizationType": string | null, "keywords": string[]}`;

async function callGemini(query: string): Promise<ExtractedCriteria> {
  const apiKey = process.env['GEMINI_API_KEY'];

  if (!apiKey) {
    console.warn('⚠️ GEMINI_API_KEY not set — falling back to bilingual keyword extraction');
    throw new Error('GEMINI_API_KEY not configured');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: SYSTEM_PROMPT }],
        },
        contents: [
          {
            role: 'user',
            parts: [{ text: query }],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 256,
          responseMimeType: 'application/json',
        },
      }),
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Gemini API error (${response.status}):`, errorBody);
      throw new Error(`Gemini API returned ${response.status}`);
    }

    const data = (await response.json()) as GeminiResponse;
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error('Empty response from Gemini');
    }

    const cleanText = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    const parsed = JSON.parse(cleanText) as Record<string, unknown>;

    return {
      specialty: typeof parsed['specialty'] === 'string' ? parsed['specialty'] : null,
      location: typeof parsed['location'] === 'string' ? parsed['location'] : null,
      organizationType: typeof parsed['organizationType'] === 'string' ? parsed['organizationType'] : null,
      keywords: Array.isArray(parsed['keywords'])
        ? (parsed['keywords'] as unknown[]).filter((k): k is string => typeof k === 'string')
        : [],
    };
  } catch (error) {
    clearTimeout(timeout);
    throw error;
  }
}

/** Bilingual fallback extractor */
const BILINGUAL_SPECIALTY_MAP: Array<{ keywords: string[]; value: string }> = [
  { keywords: ['جلدية', 'تجميل', 'ليزر', 'derm', 'skin', 'acne'], value: 'جلدية' },
  { keywords: ['قلب', 'قسطرة', 'شرايين', 'cardio', 'heart'], value: 'قلب' },
  { keywords: ['أطفال', 'رضع', 'حديثي الولادة', 'pediatr', 'child'], value: 'أطفال' },
  { keywords: ['عظام', 'مفاصل', 'ركبة', 'عمود فقري', 'ortho', 'bone'], value: 'عظام' },
  { keywords: ['مخ', 'أعصاب', 'غضروف', 'neuro', 'brain'], value: 'أعصاب' },
  { keywords: ['عيون', 'ليزك', 'بصر', 'eye', 'ophthalm'], value: 'عيون' },
  { keywords: ['نساء', 'توليد', 'حقن مجهري', 'obgyn', 'women'], value: 'نساء' },
];

const BILINGUAL_LOCATION_MAP: Array<{ keywords: string[]; value: string }> = [
  { keywords: ['شروق', 'shorouk'], value: 'الشروق' },
  { keywords: ['تجمع', 'new cairo'], value: 'القاهرة الجديده' },
  { keywords: ['معادي', 'قاهرة', 'cairo'], value: 'القاهرة' },
  { keywords: ['أكتوبر', 'جيزة', 'giza', 'october'], value: 'الجيزة' },
  { keywords: ['إسكندرية', 'alex'], value: 'الإسكندرية' },
];

function fallbackExtract(query: string): ExtractedCriteria {
  const lower = query.toLowerCase();

  let specialty: string | null = null;
  for (const item of BILINGUAL_SPECIALTY_MAP) {
    if (item.keywords.some((kw) => lower.includes(kw))) {
      specialty = item.value;
      break;
    }
  }

  let location: string | null = null;
  for (const item of BILINGUAL_LOCATION_MAP) {
    if (item.keywords.some((kw) => lower.includes(kw))) {
      location = item.value;
      break;
    }
  }

  let organizationType: string | null = null;
  if (lower.includes('مستشفى') || lower.includes('hospital')) organizationType = 'hospital';
  else if (lower.includes('عياد') || lower.includes('clinic')) organizationType = 'clinic';
  else if (lower.includes('مركز') || lower.includes('center')) organizationType = 'medical_center';

  const keywords = query.split(/\s+/).filter((w) => w.length > 2);

  return { specialty, location, organizationType, keywords };
}

export async function extractSearchCriteria(query: string): Promise<{
  criteria: ExtractedCriteria;
  source: 'gemini' | 'fallback';
}> {
  try {
    const criteria = await callGemini(query);
    console.log('✅ Gemini extraction successful:', criteria);
    return { criteria, source: 'gemini' };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.warn(`⚠️ Gemini call bypassed (${message}), using bilingual fallback extractor`);
    const criteria = fallbackExtract(query);
    return { criteria, source: 'fallback' };
  }
}
