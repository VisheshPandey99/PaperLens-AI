import { NextRequest, NextResponse } from "next/server";
import { getServerUserSession } from "@/lib/auth/session";
import { aiService } from "@/services/ai/aiService";
import { prisma } from "@/lib/db/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerUserSession();
    if (!session) {
      return NextResponse.json({ error: "UNAUTHORIZED", message: "Sign in required." }, { status: 401 });
    }

    const body = await req.json();
    const { papers } = body;

    if (!Array.isArray(papers) || papers.length < 2 || papers.length > 5) {
      return NextResponse.json(
        { error: "INVALID_INPUT", message: "Comparison requires between 2 and 5 research papers." },
        { status: 400 }
      );
    }

    const comparison = await aiService.comparePapers(papers);

    const saved = await prisma.comparison.create({
      data: {
        userId: session.id,
        title: comparison.title,
        paperIds: JSON.stringify(papers.map((p) => p.id || p.title)),
        matrixData: JSON.stringify(comparison.papers),
        crossPaperGap: comparison.crossPaperGap,
      },
    });

    return NextResponse.json({
      success: true,
      id: saved.id,
      comparison,
    });
  } catch (error: any) {
    console.error("Comparison route error:", error);
    return NextResponse.json(
      { error: "COMPARE_FAILED", message: "Unable to complete cross-paper comparison." },
      { status: 500 }
    );
  }
}
