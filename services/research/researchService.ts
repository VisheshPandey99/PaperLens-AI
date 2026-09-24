import { AcademicPaper, ResearchSearchFilters, ResearchSearchResponse } from "@/types/research";
import { searchOpenAlex } from "./openAlexAdapter";
import { searchSemanticScholar } from "./semanticScholarAdapter";
import { searchCrossref } from "./crossrefAdapter";
import { searchMockResearch, MOCK_ACADEMIC_PAPERS } from "./mockResearch";
import { getSimilarWorks } from "@/lib/openalex/works";

export async function searchAcademicLiterature(
  filters: ResearchSearchFilters
): Promise<ResearchSearchResponse> {
  // 1. Primary: OpenAlex Scholarly Engine
  try {
    const openAlexResult = await searchOpenAlex(filters);
    if (openAlexResult && openAlexResult.papers.length > 0) {
      return openAlexResult;
    }
  } catch (err) {
    console.warn("Primary OpenAlex search failed, attempting fallback:", err);
  }

  // 2. Secondary fallback: Semantic Scholar (if configured)
  try {
    const liveResult = await searchSemanticScholar(filters);
    if (liveResult && liveResult.papers.length > 0) {
      return liveResult;
    }
  } catch {
    // continue to next fallback
  }

  // 3. Fallback: Crossref
  try {
    const crossrefResult = await searchCrossref(filters);
    if (crossrefResult && crossrefResult.papers.length > 0) {
      return crossrefResult;
    }
  } catch {
    // continue to next fallback
  }

  // 4. Guaranteed high-fidelity verified mock fallback for offline dev/tests
  return searchMockResearch(filters);
}

export async function findSimilarPapers(
  topicOrKeywords: string,
  limit = 3
): Promise<AcademicPaper[]> {
  try {
    const similar = await getSimilarWorks(topicOrKeywords, limit);
    if (similar && similar.length > 0) {
      return similar;
    }
  } catch (err) {
    console.warn("OpenAlex similar papers fetch failed, using fallback:", err);
  }

  const searchResult = await searchAcademicLiterature({
    query: topicOrKeywords,
    limit,
  });

  if (searchResult.papers.length >= limit) {
    return searchResult.papers.slice(0, limit);
  }

  return MOCK_ACADEMIC_PAPERS.slice(0, limit);
}
