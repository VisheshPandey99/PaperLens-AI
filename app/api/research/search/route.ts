import { NextRequest, NextResponse } from "next/server";
import { searchWorks } from "@/lib/openalex/works";
import { OpenAlexError } from "@/lib/openalex/client";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const query = searchParams.get("query") || "";
    const institution = searchParams.get("institution") || undefined;
    const institutionType = searchParams.get("institutionType") || undefined;
    const year = searchParams.get("year") ? parseInt(searchParams.get("year")!, 10) : undefined;
    const yearMin = searchParams.get("yearMin") ? parseInt(searchParams.get("yearMin")!, 10) : undefined;
    const yearMax = searchParams.get("yearMax") ? parseInt(searchParams.get("yearMax")!, 10) : undefined;
    const openAccessOnly = searchParams.get("openAccessOnly") === "true";
    const minCitations = searchParams.get("minCitations") ? parseInt(searchParams.get("minCitations")!, 10) : undefined;
    const sort = searchParams.get("sort") || "relevance";
    const page = searchParams.get("page") ? parseInt(searchParams.get("page")!, 10) : 1;
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : 12;
    const topic = searchParams.get("topic") || undefined;
    const doi = searchParams.get("doi") || undefined;

    const result = await searchWorks({
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
      topic,
      doi,
    });

    return NextResponse.json({
      success: true,
      papers: result.papers,
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages,
      query: result.query,
      institution: result.institutionResolved,
      source: "OpenAlex",
    });
  } catch (err: any) {
    console.error("OpenAlex search route error:", err);

    if (err instanceof OpenAlexError) {
      return NextResponse.json(
        {
          error: "SEARCH_FAILED",
          message: err.userMessage,
        },
        { status: err.statusCode && err.statusCode < 500 ? err.statusCode : 500 }
      );
    }

    return NextResponse.json(
      {
        error: "SEARCH_FAILED",
        message: "Research discovery is temporarily unavailable. Please try again.",
      },
      { status: 500 }
    );
  }
}
