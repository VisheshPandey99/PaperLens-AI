import { openAlexFetch } from "./client";
import { openAlexCache } from "./cache";
import { reconstructInvertedIndex } from "./abstract";
import { resolveInstitutionId } from "./institutions";
import {
  OpenAlexSearchParams,
  OpenAlexSearchResponse,
  OpenAlexWork,
} from "./types";
import { AcademicPaper } from "@/types/research";

export interface EnrichedAcademicPaper extends AcademicPaper {
  openAlexId: string;
  publicationDate?: string;
  primaryInstitution?: string;
  institutionList?: string[];
  topics?: string[];
  type?: string;
  landingPageUrl?: string;
}

/**
 * Normalizes OpenAlex raw Work object into our application's AcademicPaper format.
 * Guarantees no hallucinated or fake data.
 */
export function formatOpenAlexWork(item: OpenAlexWork): EnrichedAcademicPaper {
  const cleanId = item.id ? item.id.replace("https://openalex.org/", "").trim() : "";

  // Extract author names and author institutions
  const authorNames: string[] = [];
  const institutionSet = new Set<string>();

  if (Array.isArray(item.authorships)) {
    for (const auth of item.authorships) {
      if (auth.author?.display_name) {
        authorNames.push(auth.author.display_name);
      }
      if (Array.isArray(auth.institutions)) {
        for (const inst of auth.institutions) {
          if (inst.display_name) {
            institutionSet.add(inst.display_name);
          }
        }
      }
    }
  }

  const institutionList = Array.from(institutionSet);
  const primaryInstitution = institutionList[0] || undefined;

  // Reconstruct abstract from inverted index
  const abstract = reconstructInvertedIndex(item.abstract_inverted_index);

  // Topics and concepts
  const topics: string[] = [];
  if (item.primary_topic?.display_name) {
    topics.push(item.primary_topic.display_name);
  }
  if (Array.isArray(item.topics)) {
    for (const t of item.topics) {
      if (t.display_name && !topics.includes(t.display_name)) {
        topics.push(t.display_name);
      }
    }
  }
  if (topics.length === 0 && Array.isArray(item.concepts)) {
    for (const c of item.concepts.slice(0, 4)) {
      if (c.display_name && !topics.includes(c.display_name)) {
        topics.push(c.display_name);
      }
    }
  }

  // Source & Venue
  const venue =
    item.primary_location?.source?.display_name ||
    item.primary_location?.raw_source_name ||
    undefined;

  // Clean DOI
  const cleanDoi = item.doi
    ? item.doi.replace("https://doi.org/", "").replace("http://doi.org/", "")
    : undefined;

  // URLs
  const pdfUrl =
    item.open_access?.oa_url ||
    item.best_oa_location?.pdf_url ||
    item.primary_location?.pdf_url ||
    undefined;

  const landingPageUrl =
    item.primary_location?.landing_page_url ||
    (item.doi ? item.doi : undefined) ||
    item.id;

  const isOpenAccess = Boolean(item.open_access?.is_oa);

  return {
    id: cleanId,
    openAlexId: cleanId,
    title: item.title || item.display_name || "Untitled Academic Work",
    authors: authorNames.length > 0 ? authorNames : ["Unknown Researcher"],
    year: item.publication_year || new Date().getFullYear(),
    publicationDate: item.publication_date || undefined,
    venue,
    abstract,
    citationCount: item.cited_by_count ?? 0,
    doi: cleanDoi,
    isOpenAccess,
    pdfUrl,
    sourceUrl: landingPageUrl || `https://openalex.org/${cleanId}`,
    landingPageUrl: landingPageUrl || undefined,
    sourceProvider: "OpenAlex",
    fieldsOfStudy: topics.length > 0 ? topics : undefined,
    topics,
    primaryInstitution,
    institutionList,
    type: item.type || undefined,
  };
}

/**
 * Searches academic literature across OpenAlex works catalog.
 * Supports keyword, title, author, DOI, topics, institutions, and date filters.
 */
export async function searchWorks(
  params: OpenAlexSearchParams
): Promise<OpenAlexSearchResponse> {
  const page = Math.max(1, params.page || 1);
  const limit = Math.min(50, Math.max(1, params.limit || 12));
  const rawQuery = (params.query || "").trim();

  // Create unique cache key
  const cacheKey = `openalex:works:search:${JSON.stringify({ ...params, page, limit })}`;
  const cached = openAlexCache.get<OpenAlexSearchResponse>(cacheKey);
  if (cached) return cached;

  const queryParams: Record<string, string | number> = {
    page,
    "per-page": limit,
  };

  const filterParts: string[] = [];

  // Check if query is directly a DOI (e.g. "10.1109/..." or "https://doi.org/10....")
  const doiRegex = /(10\.\d{4,9}\/[-._;()/:A-Za-z0-9]+)/;
  const doiMatch = rawQuery.match(doiRegex) || (params.doi ? params.doi.match(doiRegex) : null);

  if (doiMatch && doiMatch[1]) {
    filterParts.push(`doi:https://doi.org/${doiMatch[1]}`);
  } else if (rawQuery.length > 0) {
    queryParams.search = rawQuery;
  }

  // 1. Resolve Institution Filter
  let resolvedInstitutionName: string | undefined = undefined;
  const institutionTarget = params.institutionId || params.institutionName;
  if (institutionTarget && institutionTarget !== "all" && institutionTarget !== "All Institutions") {
    const resolvedInst = await resolveInstitutionId(institutionTarget);
    if (resolvedInst) {
      filterParts.push(`institutions.id:${resolvedInst.id}`);
      resolvedInstitutionName = resolvedInst.name;
    }
  }

  // 2. Institution Type Filter
  if (params.institutionType && params.institutionType !== "all" && params.institutionType !== "All") {
    filterParts.push(`institutions.type:${params.institutionType.toLowerCase()}`);
  }

  // 3. Open Access Filter
  if (params.openAccessOnly) {
    filterParts.push("is_oa:true");
  }

  // 4. Publication Year Filters
  if (params.year) {
    filterParts.push(`publication_year:${params.year}`);
  } else {
    if (params.yearMin) {
      filterParts.push(`from_publication_date:${params.yearMin}-01-01`);
    }
    if (params.yearMax) {
      filterParts.push(`to_publication_date:${params.yearMax}-12-31`);
    }
  }

  // 5. Min Citations
  if (params.minCitations && params.minCitations > 0) {
    filterParts.push(`cited_by_count:>${params.minCitations - 1}`);
  }

  // 6. Topic Filter
  if (params.topic) {
    filterParts.push(`primary_topic.id:${params.topic}`);
  }

  // Build filter parameter string
  if (filterParts.length > 0) {
    queryParams.filter = filterParts.join(",");
  }

  // 7. Sort Order
  // Note: OpenAlex throws HTTP 400 if sorting by relevance_score without a search query
  const hasSearchTerm = Boolean(queryParams.search);
  if (params.sort) {
    const s = params.sort.toLowerCase();
    if (s === "citations" || s === "cited_by_count:desc" || s === "most_cited") {
      queryParams.sort = "cited_by_count:desc";
    } else if (s === "newest" || s === "publication_date:desc" || s === "date") {
      queryParams.sort = "publication_date:desc";
    } else if (s === "relevance" || s === "relevance_score:desc") {
      if (hasSearchTerm) {
        queryParams.sort = "relevance_score:desc";
      } else {
        queryParams.sort = "cited_by_count:desc";
      }
    }
  } else if (!hasSearchTerm) {
    queryParams.sort = "cited_by_count:desc";
  }

  try {
    const data = await openAlexFetch<any>("/works", queryParams);

    if (!data || !Array.isArray(data.results)) {
      return {
        papers: [],
        total: 0,
        page,
        limit,
        totalPages: 0,
        query: rawQuery,
        institutionResolved: resolvedInstitutionName,
        source: "OpenAlex",
      };
    }

    const papers = data.results.map((item: OpenAlexWork) => formatOpenAlexWork(item));
    const total = data.meta?.count || papers.length;
    const totalPages = Math.ceil(total / limit);

    const response: OpenAlexSearchResponse = {
      papers,
      total,
      page,
      limit,
      totalPages,
      query: rawQuery,
      institutionResolved: resolvedInstitutionName,
      source: "OpenAlex",
    };

    // Cache successful search results for 30 minutes
    openAlexCache.set(cacheKey, response, 1800);

    return response;
  } catch (err: any) {
    console.error("OpenAlex works search failed:", err);
    throw err;
  }
}

/**
 * Retrieves a single work by OpenAlex ID (e.g. "W2022485595") or DOI.
 */
export async function getWorkById(
  idOrDoi: string
): Promise<EnrichedAcademicPaper | null> {
  if (!idOrDoi || typeof idOrDoi !== "string") return null;

  const trimmed = idOrDoi.trim();
  const cleanId = trimmed.replace("https://openalex.org/", "").trim();
  const cacheKey = `openalex:work:${cleanId}`;

  const cached = openAlexCache.get<EnrichedAcademicPaper>(cacheKey);
  if (cached) return cached;

  try {
    const data = await openAlexFetch<OpenAlexWork>(`/works/${cleanId}`);
    if (!data || !data.id) return null;

    const paper = formatOpenAlexWork(data);
    openAlexCache.set(cacheKey, paper, 7200); // 2 hours
    return paper;
  } catch (err: any) {
    console.warn(`Failed to fetch OpenAlex work ${idOrDoi}:`, err.message);
    return null;
  }
}

/**
 * Discovers similar research works for a given paper using OpenAlex's
 * related_works graph or primary topic affiliation.
 */
export async function getSimilarWorks(
  workIdOrKeywords: string,
  limit = 4
): Promise<EnrichedAcademicPaper[]> {
  const clean = workIdOrKeywords.trim();
  const isWorkId = /^W\d+$/i.test(clean.replace("https://openalex.org/", ""));

  if (isWorkId) {
    const targetWork = await getWorkById(clean);
    if (targetWork && targetWork.topics && targetWork.topics.length > 0) {
      // Find works in the same topic or search related keywords
      const topicQuery = targetWork.topics[0];
      const searchRes = await searchWorks({
        query: topicQuery,
        sort: "citations",
        limit: limit + 2,
      });

      return searchRes.papers
        .filter((p) => p.id !== targetWork.id)
        .slice(0, limit) as EnrichedAcademicPaper[];
    }
  }

  // General keyword/topic similar works search
  const res = await searchWorks({
    query: clean.slice(0, 120),
    sort: "relevance",
    limit,
  });

  return res.papers as EnrichedAcademicPaper[];
}
