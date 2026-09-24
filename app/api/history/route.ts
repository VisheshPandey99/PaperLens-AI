import { NextRequest, NextResponse } from "next/server";
import { getServerUserSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerUserSession();
    if (!session) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const [analyses, generatedPapers, comparisons, savedPapers] = await Promise.all([
      prisma.analysis.findMany({
        where: { userId: session.id },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          status: true,
          confidenceScore: true,
          gapProminence: true,
          createdAt: true,
        },
      }),
      prisma.generatedPaper.findMany({
        where: { userId: session.id },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          wordCount: true,
          status: true,
          citationStyle: true,
          createdAt: true,
        },
      }),
      prisma.comparison.findMany({
        where: { userId: session.id },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          createdAt: true,
        },
      }),
      prisma.savedPaper.findMany({
        where: { userId: session.id },
        orderBy: { createdAt: "desc" },
        include: { paper: true },
      }),
    ]);

    return NextResponse.json({
      analyses: analyses.map((a) => ({ ...a, type: "ANALYSIS" })),
      generatedPapers: generatedPapers.map((g) => ({ ...g, type: "GENERATED_DRAFT" })),
      comparisons: comparisons.map((c) => ({ ...c, type: "COMPARISON" })),
      savedPapers: savedPapers.map((s) => ({
        id: s.id,
        title: s.paper.title,
        authors: JSON.parse(s.paper.authors || "[]"),
        year: s.paper.year,
        doi: s.paper.doi,
        sourceUrl: s.paper.sourceUrl,
        type: "SAVED_PAPER",
        createdAt: s.createdAt,
      })),
    });
  } catch (error) {
    console.error("History fetch error:", error);
    return NextResponse.json({ error: "Failed to load research history" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerUserSession();
    if (!session) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const type = searchParams.get("type");

    if (!id || !type) {
      return NextResponse.json({ error: "Missing id or type" }, { status: 400 });
    }

    if (type === "ANALYSIS") {
      await prisma.analysis.deleteMany({ where: { id, userId: session.id } });
    } else if (type === "GENERATED_DRAFT") {
      await prisma.generatedPaper.deleteMany({ where: { id, userId: session.id } });
    } else if (type === "COMPARISON") {
      await prisma.comparison.deleteMany({ where: { id, userId: session.id } });
    } else if (type === "SAVED_PAPER") {
      await prisma.savedPaper.deleteMany({ where: { id, userId: session.id } });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete history item" }, { status: 500 });
  }
}
