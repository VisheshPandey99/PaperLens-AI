import { openAlexFetch } from "./client";
import { openAlexCache } from "./cache";
import { OpenAlexInstitutionResponse, OpenAlexInstitutionResult } from "./types";
import { prisma } from "@/lib/db/prisma";

/**
 * Curated list of verified Indian Institutes (IITs, NITs, Central Universities)
 * mapped to their authentic OpenAlex IDs and display names.
 * OpenAlex indexes millions of papers affiliated with these institutions.
 */
export interface CuratedInstitution {
  id: string; // OpenAlex clean ID
  name: string;
  category: "IIT" | "NIT" | "UNIVERSITY" | "INSTITUTE";
  city?: string;
}

export const CURATED_INDIAN_INSTITUTIONS: CuratedInstitution[] = [
  // IITs
  { id: "I68891433", name: "IIT Delhi", category: "IIT", city: "New Delhi" },
  { id: "I162827531", name: "IIT Bombay", category: "IIT", city: "Mumbai" },
  { id: "I24535311", name: "IIT Madras", category: "IIT", city: "Chennai" },
  { id: "I4734840", name: "IIT Kanpur", category: "IIT", city: "Kanpur" },
  { id: "I59275088", name: "IIT Kharagpur", category: "IIT", city: "Kharagpur" },
  { id: "I6713735", name: "IIT Roorkee", category: "IIT", city: "Roorkee" },
  { id: "I86950790", name: "IIT Hyderabad", category: "IIT", city: "Hyderabad" },
  { id: "I36993188", name: "IIT Guwahati", category: "IIT", city: "Guwahati" },
  { id: "I116812854", name: "IIT Indore", category: "IIT", city: "Indore" },
  { id: "I93297127", name: "IIT BHU (Varanasi)", category: "IIT", city: "Varanasi" },
  { id: "I157640477", name: "IIT Patna", category: "IIT", city: "Patna" },
  { id: "I193910940", name: "IIT Gandhinagar", category: "IIT", city: "Gandhinagar" },
  { id: "I154784949", name: "IIT Ropar", category: "IIT", city: "Rupnagar" },
  { id: "I204250577", name: "IIT Bhubaneswar", category: "IIT", city: "Bhubaneswar" },
  { id: "I190365779", name: "IIT Jodhpur", category: "IIT", city: "Jodhpur" },
  { id: "I185202685", name: "IIT Mandi", category: "IIT", city: "Mandi" },
  { id: "I2799307774", name: "IIT Tirupati", category: "IIT", city: "Tirupati" },
  { id: "I2799517172", name: "IIT Palakkad", category: "IIT", city: "Palakkad" },

  // NITs
  { id: "I122964287", name: "NIT Trichy (Tiruchirappalli)", category: "NIT", city: "Tiruchirappalli" },
  { id: "I165842886", name: "NIT Warangal", category: "NIT", city: "Warangal" },
  { id: "I46559032", name: "NIT Rourkela", category: "NIT", city: "Rourkela" },
  { id: "I108605273", name: "NIT Surathkal (Karnataka)", category: "NIT", city: "Surathkal" },
  { id: "I147879685", name: "NIT Calicut", category: "NIT", city: "Calicut" },
  { id: "I181288599", name: "MNNIT Allahabad", category: "NIT", city: "Prayagraj" },
  { id: "I122394595", name: "MNIT Jaipur", category: "NIT", city: "Jaipur" },
  { id: "I99249767", name: "NIT Kurukshetra", category: "NIT", city: "Kurukshetra" },
  { id: "I189445107", name: "NIT Durgapur", category: "NIT", city: "Durgapur" },
  { id: "I178822588", name: "NIT Silchar", category: "NIT", city: "Silchar" },
  { id: "I138981442", name: "NIT Jalandhar", category: "NIT", city: "Jalandhar" },
  { id: "I142416174", name: "NIT Hamirpur", category: "NIT", city: "Hamirpur" },
  { id: "I128368852", name: "VNIT Nagpur", category: "NIT", city: "Nagpur" },
  { id: "I152438887", name: "MANIT Bhopal", category: "NIT", city: "Bhopal" },
  { id: "I153323067", name: "SVNIT Surat", category: "NIT", city: "Surat" },

  // Premier Universities & Research Institutes
  { id: "I51556381", name: "Indian Institute of Science (IISc)", category: "INSTITUTE", city: "Bengaluru" },
  { id: "I178201267", name: "All India Institute of Medical Sciences (AIIMS)", category: "INSTITUTE", city: "New Delhi" },
  { id: "I153496603", name: "Tata Institute of Fundamental Research (TIFR)", category: "INSTITUTE", city: "Mumbai" },
  { id: "I112952445", name: "Jawaharlal Nehru University (JNU)", category: "UNIVERSITY", city: "New Delhi" },
  { id: "I192463273", name: "University of Delhi", category: "UNIVERSITY", city: "Delhi" },
  { id: "I169420603", name: "Banaras Hindu University (BHU)", category: "UNIVERSITY", city: "Varanasi" },
  { id: "I182741916", name: "Anna University", category: "UNIVERSITY", city: "Chennai" },
  { id: "I128913980", name: "Jadavpur University", category: "UNIVERSITY", city: "Kolkata" },
];

/**
 * Searches institutions via OpenAlex Institutions API.
 */
export async function searchInstitutions(
  query: string,
  limit = 10
): Promise<OpenAlexInstitutionResult[]> {
  const cacheKey = `openalex:institutions:${query.toLowerCase().trim()}:${limit}`;
  const cached = openAlexCache.get<OpenAlexInstitutionResult[]>(cacheKey);
  if (cached) return cached;

  try {
    const data = await openAlexFetch<OpenAlexInstitutionResponse>("/institutions", {
      search: query,
      "per-page": limit,
    });

    if (!data || !Array.isArray(data.results)) {
      return [];
    }

    const results: OpenAlexInstitutionResult[] = data.results.map((inst) => {
      const cleanId = inst.id.replace("https://openalex.org/", "");
      return {
        id: inst.id,
        openAlexId: cleanId,
        displayName: inst.display_name,
        ror: inst.ror || null,
        countryCode: inst.country_code || null,
        type: inst.type || null,
        worksCount: inst.works_count || 0,
        citedByCount: inst.cited_by_count || 0,
        homepageUrl: inst.homepage_url || null,
        imageUrl: inst.image_url || null,
        acronym: inst.display_name_acronyms?.[0],
      };
    });

    openAlexCache.set(cacheKey, results, 86400); // 24h TTL

    return results;
  } catch (err) {
    console.warn(`Institution search failed for "${query}":`, err);
    return [];
  }
}

/**
 * Fetches an institution by its OpenAlex ID.
 */
export async function getInstitutionById(
  id: string
): Promise<OpenAlexInstitutionResult | null> {
  const cleanId = id.replace("https://openalex.org/", "").trim();
  const cacheKey = `openalex:institution:${cleanId}`;
  const cached = openAlexCache.get<OpenAlexInstitutionResult>(cacheKey);
  if (cached) return cached;

  try {
    const data = await openAlexFetch<any>(`/institutions/${cleanId}`);
    if (!data || !data.id) return null;

    const result: OpenAlexInstitutionResult = {
      id: data.id,
      openAlexId: cleanId,
      displayName: data.display_name,
      ror: data.ror || null,
      countryCode: data.country_code || null,
      type: data.type || null,
      worksCount: data.works_count || 0,
      citedByCount: data.cited_by_count || 0,
      homepageUrl: data.homepage_url || null,
      imageUrl: data.image_url || null,
      acronym: data.display_name_acronyms?.[0],
    };

    openAlexCache.set(cacheKey, result, 86400);
    return result;
  } catch (err) {
    console.warn(`Failed to fetch institution ${id}:`, err);
    return null;
  }
}

/**
 * Resolves an institution query (e.g. "IIT Delhi", "NIT Trichy", or clean ID "I68891433")
 * into a verified OpenAlex institution ID.
 * Uses:
 * 1. Direct ID check (if starts with 'I' + digits)
 * 2. In-memory cache
 * 3. Curated Indian Institutions lookup
 * 4. Local Database lookup (prisma.institution)
 * 5. OpenAlex Institutions API dynamic search
 */
export async function resolveInstitutionId(
  nameOrId: string
): Promise<{ id: string; name: string } | null> {
  if (!nameOrId || typeof nameOrId !== "string") return null;

  const trimmed = nameOrId.trim();

  // If already an OpenAlex ID (e.g. "I68891433" or "https://openalex.org/I68891433")
  const idMatch = trimmed.match(/(?:https:\/\/openalex\.org\/)?(I\d+)/i);
  if (idMatch && idMatch[1]) {
    const cleanId = idMatch[1].toUpperCase();
    const curated = CURATED_INDIAN_INSTITUTIONS.find(
      (c) => c.id.toUpperCase() === cleanId
    );
    return {
      id: cleanId,
      name: curated ? curated.name : `Institution ${cleanId}`,
    };
  }

  const normalized = trimmed.toLowerCase();

  // Check curated list first
  const curatedMatch = CURATED_INDIAN_INSTITUTIONS.find(
    (c) =>
      c.name.toLowerCase() === normalized ||
      c.name.toLowerCase().includes(normalized) ||
      normalized.includes(c.name.toLowerCase())
  );
  if (curatedMatch) {
    return { id: curatedMatch.id, name: curatedMatch.name };
  }

  // Check in-memory cache
  const cacheKey = `institution:resolve:${normalized}`;
  const cached = openAlexCache.get<{ id: string; name: string }>(cacheKey);
  if (cached) return cached;

  // Check local database
  try {
    const dbInstitution = await prisma.institution.findFirst({
      where: {
        name: {
          contains: trimmed,
        },
      },
    });

    if (dbInstitution) {
      const res = { id: dbInstitution.openAlexId, name: dbInstitution.name };
      openAlexCache.set(cacheKey, res, 86400);
      return res;
    }
  } catch {
    // Non-fatal if db is busy
  }

  // Fallback to OpenAlex Live Institution Search
  try {
    const searchResults = await searchInstitutions(trimmed, 3);
    if (searchResults.length > 0) {
      const topMatch = searchResults[0];
      const res = { id: topMatch.openAlexId, name: topMatch.displayName };

      // Save in cache
      openAlexCache.set(cacheKey, res, 86400);

      // Async persist in database
      prisma.institution
        .upsert({
          where: { openAlexId: topMatch.openAlexId },
          update: {
            name: topMatch.displayName,
            countryCode: topMatch.countryCode,
            type: topMatch.type,
            ror: topMatch.ror,
            worksCount: topMatch.worksCount,
          },
          create: {
            openAlexId: topMatch.openAlexId,
            name: topMatch.displayName,
            countryCode: topMatch.countryCode,
            type: topMatch.type,
            ror: topMatch.ror,
            worksCount: topMatch.worksCount,
          },
        })
        .catch(() => {});

      return res;
    }
  } catch (err) {
    console.warn(`Could not resolve institution for "${trimmed}":`, err);
  }

  return null;
}
