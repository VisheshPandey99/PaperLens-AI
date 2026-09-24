import { AcademicPaper, ResearchSearchFilters, ResearchSearchResponse } from "@/types/research";

export async function searchSemanticScholar(filters: ResearchSearchFilters): Promise<ResearchSearchResponse | null> {
  try {
    const apiKey = process.env.SEMANTIC_SCHOLAR_API_KEY;
    const query = encodeURIComponent(filters.query);
    const limit = filters.limit || 10;
    const offset = filters.offset || 0;

    const url = `https://api.semanticscholar.org/graph/v1/paper/search?query=${query}&offset=${offset}&limit=${limit}&fields=paperId,title,abstract,authors,year,citationCount,isOpenAccess,openAccessPdf,externalIds,venue`;

    const headers: Record<string, string> = {};
    if (apiKey) {
      headers["x-api-key"] = apiKey;
    }

    const res = await fetch(url, {
      headers,
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(6000),
    });

    if (!res.ok) {
      console.warn(`Semantic Scholar API responded with status ${res.status}`);
      return null;
    }

    const data = await res.json();
    if (!data || !Array.isArray(data.data)) {
      return null;
    }

    const papers: AcademicPaper[] = data.data.map((item: any) => ({
      id: item.paperId || Math.random().toString(),
      title: item.title || "Untitled Paper",
      authors: (item.authors || []).map((a: any) => a.name),
      year: item.year || new Date().getFullYear(),
      venue: item.venue || undefined,
      abstract: item.abstract || "Abstract not provided in public repository.",
      citationCount: item.citationCount || 0,
      doi: item.externalIds?.DOI || undefined,
      isOpenAccess: !!item.isOpenAccess,
      pdfUrl: item.openAccessPdf?.url || undefined,
      sourceUrl: item.externalIds?.DOI ? `https://doi.org/${item.externalIds.DOI}` : `https://www.semanticscholar.org/paper/${item.paperId}`,
      sourceProvider: "Semantic Scholar",
    }));

    return {
      papers,
      total: data.total || papers.length,
      query: filters.query,
      source: "Semantic Scholar API",
    };
  } catch (err) {
    console.warn("Semantic Scholar search failed:", err);
    return null;
  }
}
