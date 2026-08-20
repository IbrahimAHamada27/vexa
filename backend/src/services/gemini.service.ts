/**
 * Gemini AI Service — Smart Healthcare Search Criteria Extractor
 *
 * Responsibilities:
 * 1. Call Gemini API to extract structured search criteria from natural language.
 * 2. Enforce strict guardrails: NO medical advice, diagnosis, or prescriptions.
 * 3. Provide robust regex/keyword fallback when Gemini is unavailable.
 */

// ─── Types ──────────────────────────────────────────────────────────────────

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

// ─── System Prompt ──────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are a healthcare search criteria extractor for the VEXA Healthcare Platform in Egypt.

ROLE: Extract structured search parameters from user queries. That is your ONLY function.

STRICT RULES:
- You MUST NEVER diagnose any condition.
- You MUST NEVER prescribe or recommend any medication.
- You MUST NEVER give medical advice of any kind.
- You MUST NEVER suggest treatments or procedures.
- If the user asks for medical advice, set all fields to null and put their query terms in keywords.

TASK: Given a user's natural language query about finding healthcare services, extract:
1. "specialty" — the medical specialty mentioned (e.g., "Dermatology", "Cardiology", "Pediatrics", "Orthopedics"). Normalize to standard specialty names. Return null if not specified.
2. "location" — the city, area, or district mentioned (e.g., "El Shorouk", "Cairo", "New Cairo"). Return null if not specified.
3. "organizationType" — one of "Clinic", "MedicalCenter", "Hospital", or null if not specified.
4. "keywords" — array of additional relevant search terms from the query.

OUTPUT FORMAT: Respond with ONLY valid JSON, no markdown, no explanation:
{"specialty": string | null, "location": string | null, "organizationType": string | null, "keywords": string[]}

EXAMPLES:
Query: "I need a dermatologist near El Shorouk"
Output: {"specialty": "Dermatology", "location": "El Shorouk", "organizationType": null, "keywords": ["dermatologist"]}

Query: "heart doctor at a hospital in Cairo"
Output: {"specialty": "Cardiology", "location": "Cairo", "organizationType": "Hospital", "keywords": ["heart", "doctor"]}

Query: "children's doctor clinic"
Output: {"specialty": "Pediatrics", "location": null, "organizationType": "Clinic", "keywords": ["children"]}

Query: "best skin treatment for acne"
Output: {"specialty": "Dermatology", "location": null, "organizationType": null, "keywords": ["skin", "acne", "treatment"]}`;

// ─── Gemini API Call ────────────────────────────────────────────────────────

/**
 * Call Gemini API to extract search criteria from the user's query.
 * Uses the REST API directly via fetch — no SDK dependency needed.
 */
async function callGemini(query: string): Promise<ExtractedCriteria> {
  const apiKey = process.env['GEMINI_API_KEY'];

  if (!apiKey) {
    console.warn('⚠️  GEMINI_API_KEY not set — falling back to keyword extraction');
    throw new Error('GEMINI_API_KEY not configured');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

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
          temperature: 0.1,
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

    // Parse JSON — strip markdown code fences if present
    const cleanText = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    const parsed = JSON.parse(cleanText) as Record<string, unknown>;

    // Validate and normalize the parsed result
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

// ─── Regex / Keyword Fallback ───────────────────────────────────────────────

/** Known medical specialties and their aliases */
const SPECIALTY_MAP: Record<string, string> = {
  // Dermatology
  dermatologist: 'Dermatology',
  dermatology: 'Dermatology',
  skin: 'Dermatology',
  'skin doctor': 'Dermatology',
  acne: 'Dermatology',
  eczema: 'Dermatology',
  // Cardiology
  cardiologist: 'Cardiology',
  cardiology: 'Cardiology',
  heart: 'Cardiology',
  'heart doctor': 'Cardiology',
  cardiac: 'Cardiology',
  // Pediatrics
  pediatrician: 'Pediatrics',
  pediatrics: 'Pediatrics',
  "children's doctor": 'Pediatrics',
  'child doctor': 'Pediatrics',
  children: 'Pediatrics',
  // Orthopedics
  orthopedic: 'Orthopedics',
  orthopedics: 'Orthopedics',
  bone: 'Orthopedics',
  'bone doctor': 'Orthopedics',
  joint: 'Orthopedics',
  sports: 'Orthopedics',
};

/** Known locations in the VEXA demo data */
const KNOWN_LOCATIONS = [
  'El Shorouk',
  'New Cairo',
  'Cairo',
  'Nasr City',
  'Garden City',
  'Heliopolis',
];

/** Organization type aliases */
const ORG_TYPE_MAP: Record<string, string> = {
  clinic: 'Clinic',
  hospital: 'Hospital',
  'medical center': 'MedicalCenter',
  'medical centre': 'MedicalCenter',
  center: 'MedicalCenter',
  centre: 'MedicalCenter',
};

/**
 * Regex/keyword fallback extractor.
 * Parses the raw query to extract specialty, location, and org type
 * without any external API dependency.
 */
function fallbackExtract(query: string): ExtractedCriteria {
  const lower = query.toLowerCase();

  // Extract specialty
  let specialty: string | null = null;
  for (const [keyword, mapped] of Object.entries(SPECIALTY_MAP)) {
    if (lower.includes(keyword)) {
      specialty = mapped;
      break;
    }
  }

  // Extract location
  let location: string | null = null;
  for (const loc of KNOWN_LOCATIONS) {
    if (lower.includes(loc.toLowerCase())) {
      location = loc;
      break;
    }
  }

  // Extract organization type
  let organizationType: string | null = null;
  for (const [keyword, mapped] of Object.entries(ORG_TYPE_MAP)) {
    if (lower.includes(keyword)) {
      organizationType = mapped;
      break;
    }
  }

  // Extract keywords: remove stop words, keep meaningful terms
  const stopWords = new Set([
    'i', 'me', 'my', 'need', 'want', 'find', 'looking', 'for', 'a', 'an',
    'the', 'in', 'at', 'near', 'to', 'with', 'and', 'or', 'of', 'can',
    'you', 'please', 'help', 'get', 'best', 'good', 'nearby', 'around',
    'close', 'search', 'show', 'recommend', 'suggestion',
  ]);

  const keywords = lower
    .replace(/[^a-z0-9\s'-]/g, '')
    .split(/\s+/)
    .filter((word) => word.length > 2 && !stopWords.has(word));

  return { specialty, location, organizationType, keywords };
}

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Extract search criteria from a user's natural language query.
 * Tries Gemini first, falls back to regex/keyword extraction on failure.
 */
export async function extractSearchCriteria(query: string): Promise<{
  criteria: ExtractedCriteria;
  source: 'gemini' | 'fallback';
}> {
  try {
    const criteria = await callGemini(query);
    console.log('✅ Gemini extraction successful');
    return { criteria, source: 'gemini' };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.warn(`⚠️  Gemini failed (${message}), using fallback extractor`);
    const criteria = fallbackExtract(query);
    return { criteria, source: 'fallback' };
  }
}
