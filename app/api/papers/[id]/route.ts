import { NextRequest, NextResponse } from "next/server";
import { getServerUserSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { getWorkById } from "@/lib/openalex/works";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const rawId = params.id.trim();
    const cleanId = rawId.replace("https://openalex.org/", "");

    // 1. Search local database first
    let paper = await prisma.researchPaper.findFirst({
      where: {
        OR: [
          { id: rawId },
          { openAlexId: cleanId },
          { externalId: cleanId },
          { doi: cleanId },
        ],
      },
      include: { analyses: true },
    });

    // 2. If not found in database, check OpenAlex live
    if (!paper) {
      const openAlexWork = await getWorkById(cleanId);
      if (openAlexWork) {
        // Persist to database without creating duplicates
        try {
          paper = await prisma.researchPaper.upsert({
            where: { openAlexId: openAlexWork.openAlexId },
            update: {
              citationCount: openAlexWork.citationCount,
              venue: openAlexWork.venue,
              isOpenAccess: openAlexWork.isOpenAccess,
              pdfUrl: openAlexWork.pdfUrl,
              sourceUrl: openAlexWork.sourceUrl,
            },
            create: {
              openAlexId: openAlexWork.openAlexId,
              title: openAlexWork.title,
              authors: JSON.stringify(openAlexWork.authors),
              abstract: openAlexWork.abstract,
              year: openAlexWork.year,
              publicationDate: openAlexWork.publicationDate,
              doi: openAlexWork.doi,
              venue: openAlexWork.venue,
              sourceUrl: openAlexWork.sourceUrl,
              sourceName: openAlexWork.venue || "Academic Publisher",
              pdfUrl: openAlexWork.pdfUrl,
              isOpenAccess: openAlexWork.isOpenAccess,
              citationCount: openAlexWork.citationCount,
              institution: openAlexWork.primaryInstitution,
              topics: JSON.stringify(openAlexWork.topics || []),
              type: openAlexWork.type,
            },
            include: { analyses: true },
          });
        } catch {
          // If upsert hit race condition, fetch existing
          paper = await prisma.researchPaper.findFirst({
            where: { openAlexId: openAlexWork.openAlexId },
            include: { analyses: true },
          });
        }
      }
    }

    if (!paper) {
      return NextResponse.json({ error: "Paper not found in academic catalog." }, { status: 404 });
    }

    let parsedAuthors: string[] = [];
    try {
      parsedAuthors = JSON.parse(paper.authors || "[]");
    } catch {
      parsedAuthors = [paper.authors];
    }

    let parsedTopics: string[] = [];
    try {
      parsedTopics = JSON.parse(paper.topics || "[]");
    } catch {
      parsedTopics = [];
    }

    return NextResponse.json({
      paper: {
        ...paper,
        authors: parsedAuthors,
        topics: parsedTopics,
      },
    });
  } catch (error) {
    console.error("Fetch paper error:", error);
    return NextResponse.json({ error: "Failed to fetch paper" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerUserSession();
    if (!session) {
      return NextResponse.json({ error: "UNAUTHORIZED", message: "Sign in required to save papers." }, { status: 401 });
    }

    const rawId = params.id.trim();
    const cleanId = rawId.replace("https://openalex.org/", "");

    // Find or create the ResearchPaper record
    let paper = await prisma.researchPaper.findFirst({
      where: {
        OR: [
          { id: rawId },
          { openAlexId: cleanId },
          { externalId: cleanId },
        ],
      },
    });

    if (!paper) {
      const openAlexWork = await getWorkById(cleanId);
      if (openAlexWork) {
        paper = await prisma.researchPaper.create({
          data: {
            openAlexId: openAlexWork.openAlexId,
            title: openAlexWork.title,
            authors: JSON.stringify(openAlexWork.authors),
            abstract: openAlexWork.abstract,
            year: openAlexWork.year,
            publicationDate: openAlexWork.publicationDate,
            doi: openAlexWork.doi,
            venue: openAlexWork.venue,
            sourceUrl: openAlexWork.sourceUrl,
            pdfUrl: openAlexWork.pdfUrl,
            isOpenAccess: openAlexWork.isOpenAccess,
            citationCount: openAlexWork.citationCount,
            institution: openAlexWork.primaryInstitution,
            topics: JSON.stringify(openAlexWork.topics || []),
            type: openAlexWork.type,
          },
        });
      } else {
        return NextResponse.json({ error: "Paper not found to save" }, { status: 404 });
      }
    }

    const body = await req.json().catch(() => ({}));
    const { notes, tags } = body;

    // Check if already saved
    const existingSaved = await prisma.savedPaper.findFirst({
      where: {
        userId: session.id,
        paperId: paper.id,
      },
    });

    if (existingSaved) {
      return NextResponse.json({ success: true, savedId: existingSaved.id, alreadySaved: true });
    }

    const saved = await prisma.savedPaper.create({
      data: {
        userId: session.id,
        paperId: paper.id,
        notes: notes || "Saved from Research Hub",
        tags: tags || "OpenAlex",
      },
    });

    return NextResponse.json({ success: true, savedId: saved.id });
  } catch (error) {
    console.error("Save paper error:", error);
    return NextResponse.json({ error: "Failed to save paper" }, { status: 500 });
  }
}
