import { ResearchSearchFilters, ResearchSearchResponse } from "@/types/research";
import { searchWorks } from "@/lib/openalex/works";

export async function searchOpenAlex(
  filters: ResearchSearchFilters
): Promise<ResearchSearchResponse | null> {
  try {
    const page = filters.offset && filters.limit
      ? Math.floor(filters.offset / filters.limit) + 1
      : 1;

    const res = await searchWorks({
      query: filters.query,
      yearMin: filters.yearMin,
      yearMax: filters.yearMax,
      openAccessOnly: filters.openAccessOnly,
      minCitations: filters.minCitations,
      page,
      limit: filters.limit || 12,
    });

    return {
      papers: res.papers,
      total: res.total,
      query: filters.query,
      source: "OpenAlex",
    };
  } catch (err) {
    console.warn("OpenAlex search adapter error:", err);
    return null;
  }
}
