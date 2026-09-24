import { NextRequest, NextResponse } from "next/server";
import { getServerUserSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { aiService } from "@/services/ai/aiService";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerUserSession();
    if (!session) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

    const draft = await prisma.generatedPaper.findUnique({
      where: { id: params.id },
    });

    if (!draft || draft.userId !== session.id) {
      return NextResponse.json({ error: "Draft not found or access denied" }, { status: 404 });
    }

    const parsedContent = JSON.parse(draft.content || "{}");

    return NextResponse.json({
      draft: {
        id: draft.id,
        title: draft.title,
        abstract: draft.abstract,
        keywords: parsedContent.keywords || [],
        sections: parsedContent.sections || [],
        citations: parsedContent.citations || [],
        status: draft.status,
        wordCount: draft.wordCount,
        citationStyle: draft.citationStyle,
        createdAt: draft.createdAt,
        updatedAt: draft.updatedAt,
      },
    });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch draft" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerUserSession();
    if (!session) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

    const draft = await prisma.generatedPaper.findUnique({
      where: { id: params.id },
    });

    if (!draft || draft.userId !== session.id) {
      return NextResponse.json({ error: "Draft not found or access denied" }, { status: 404 });
    }

    const body = await req.json();
    const { action, sectionId, sectionTitle, currentContent, updatedSections, updatedTitle } = body;

    // Sub-Action: AI Refinement of a single section
    if (action && ["expand", "shorten", "academic-tone", "fix-grammar", "explain"].includes(action)) {
      const refinedText = await aiService.refineSection(
        sectionTitle || "Section",
        currentContent || "",
        action as any
      );

      return NextResponse.json({ success: true, refinedText });
    }

    // Standard draft save / update
    const parsedContent = JSON.parse(draft.content || "{}");
    if (updatedSections) {
      parsedContent.sections = updatedSections;
    }

    const newTitle = updatedTitle || draft.title;
    const newWordCount = (parsedContent.sections || []).reduce(
      (acc: number, s: any) => acc + (s.content || "").split(/\s+/).length,
      0
    );

    const updated = await prisma.generatedPaper.update({
      where: { id: params.id },
      data: {
        title: newTitle,
        content: JSON.stringify(parsedContent),
        wordCount: newWordCount,
      },
    });

    return NextResponse.json({ success: true, draft: updated });
  } catch (err) {
    console.error("Draft update error:", err);
    return NextResponse.json({ error: "Failed to update draft" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerUserSession();
    if (!session) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

    await prisma.generatedPaper.deleteMany({
      where: { id: params.id, userId: session.id },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete draft" }, { status: 500 });
  }
}
