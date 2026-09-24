import { NextRequest, NextResponse } from "next/server";
import { searchWorks } from "@/lib/openalex/works";
import { searchAcademicLiterature } from "@/services/research/researchService";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || "machine learning transformers";
    const institution = searchParams.get("institution") || undefined;
    const institutionType = searchParams.get("institutionType") || undefined;
    const yearMin = searchParams.get("yearMin") ? parseInt(searchParams.get("yearMin")!, 10) : undefined;
    const yearMax = searchParams.get("yearMax") ? parseInt(searchParams.get("yearMax")!, 10) : undefined;
    const year = searchParams.get("year") ? parseInt(searchParams.get("year")!, 10) : undefined;
    const openAccessOnly = searchParams.get("openAccessOnly") === "true";
    const minCitations = searchParams.get("minCitations") ? parseInt(searchParams.get("minCitations")!, 10) : undefined;
    const sort = searchParams.get("sort") || "relevance";
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : 12;
    const page = searchParams.get("page") ? parseInt(searchParams.get("page")!, 10) : 1;

    // Use primary OpenAlex works search
    const results = await searchWorks({
      query,
      institutionName: institution,
      institutionType,
      year,
      yearMin,
      yearMax,
      openAccessOnly,
      minCitations,
      sort,
      page,
      limit,
    });

    return NextResponse.json({
      papers: results.papers,
      total: results.total,
      page: results.page,
      limit: results.limit,
      totalPages: results.totalPages,
      query: results.query,
      source: "OpenAlex",
    });
  } catch (err: any) {
    console.error("Paper search error, trying fallback:", err);
    try {
      const fallback = await searchAcademicLiterature({
        query: "deep learning transformers",
        limit: 10,
      });
      return NextResponse.json(fallback);
    } catch {
      return NextResponse.json(
        { error: "SEARCH_FAILED", message: "Research discovery is temporarily unavailable. Please try again." },
        { status: 500 }
      );
    }
  }
}
