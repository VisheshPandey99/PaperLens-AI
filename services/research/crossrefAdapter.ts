import { AcademicPaper, ResearchSearchFilters, ResearchSearchResponse } from "@/types/research";

export async function searchCrossref(filters: ResearchSearchFilters): Promise<ResearchSearchResponse | null> {
  try {
    const query = encodeURIComponent(filters.query);
    const rows = filters.limit || 10;
    const offset = filters.offset || 0;

    const url = `https://api.crossref.org/works?query=${query}&rows=${rows}&offset=${offset}&sort=relevance`;

    const res = await fetch(url, {
      headers: {
        "User-Agent": "PaperLensAI/1.0 (mailto:contact@paperlens.ai)",
      },
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(6000),
    });

    if (!res.ok) {
      console.warn(`Crossref API responded with status ${res.status}`);
      return null;
    }

    const data = await res.json();
    if (!data?.message?.items || !Array.isArray(data.message.items)) {
      return null;
    }

    const papers: AcademicPaper[] = data.message.items.map((item: any) => {
      const authors = (item.author || []).map((a: any) => `${a.given || ""} ${a.family || ""}`.trim()).filter(Boolean);
      const year = item["published-print"]?.["date-parts"]?.[0]?.[0] || item["published-online"]?.["date-parts"]?.[0]?.[0] || new Date().getFullYear();

      return {
        id: item.DOI || Math.random().toString(),
        title: Array.isArray(item.title) ? item.title[0] : item.title || "Untitled Paper",
        authors: authors.length ? authors : ["Academic Author"],
        year,
        venue: Array.isArray(item["container-title"]) ? item["container-title"][0] : undefined,
        abstract: item.abstract ? item.abstract.replace(/<[^>]*>?/gm, "").slice(0, 500) + "..." : "Abstract available on publisher website.",
        citationCount: item["is-referenced-by-count"] || 0,
        doi: item.DOI,
        isOpenAccess: !!item.link?.some((l: any) => l["content-type"] === "application/pdf"),
        pdfUrl: item.link?.find((l: any) => l["content-type"] === "application/pdf")?.URL,
        sourceUrl: item.URL || (item.DOI ? `https://doi.org/${item.DOI}` : "https://crossref.org"),
        sourceProvider: "Crossref",
      };
    });

    return {
      papers,
      total: data.message["total-results"] || papers.length,
      query: filters.query,
      source: "Crossref Metadata API",
    };
  } catch (err) {
    console.warn("Crossref search failed:", err);
    return null;
  }
}
