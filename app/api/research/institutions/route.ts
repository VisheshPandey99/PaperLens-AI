import { NextRequest, NextResponse } from "next/server";
import {
  searchInstitutions,
  CURATED_INDIAN_INSTITUTIONS,
} from "@/lib/openalex/institutions";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query")?.trim() || "";
    const category = searchParams.get("category")?.toUpperCase();

    // If query provided, run live OpenAlex search
    if (query.length > 1) {
      const liveResults = await searchInstitutions(query, 8);
      return NextResponse.json({
        institutions: liveResults,
        source: "OpenAlex",
      });
    }

    // Otherwise return curated list with optional category filter
    let list = CURATED_INDIAN_INSTITUTIONS;
    if (category && ["IIT", "NIT", "UNIVERSITY", "INSTITUTE"].includes(category)) {
      list = list.filter((i) => i.category === category);
    }

    return NextResponse.json({
      institutions: list,
      source: "Verified OpenAlex Registry",
    });
  } catch (err: any) {
    console.error("Institution search route error:", err);
    return NextResponse.json(
      { error: "INSTITUTIONS_FAILED", message: "Failed to retrieve institutions." },
      { status: 500 }
    );
  }
}
