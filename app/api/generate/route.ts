import { NextRequest, NextResponse } from "next/server";
import { getServerUserSession } from "@/lib/auth/session";
import { aiService } from "@/services/ai/aiService";
import { prisma } from "@/lib/db/prisma";
import { PaperGenerationPrompt } from "@/types/generator";
import { searchWorks } from "@/lib/openalex/works";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerUserSession();
    if (!session) {
      return NextResponse.json(
        { error: "UNAUTHORIZED", message: "Please sign in to generate research paper drafts." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      topic,
      problem,
      objective,
      field,
      methodology,
      targetLengthWords,
      citationStyle,
      additionalInstructions,
    } = body;

    if (!topic || !problem || !objective) {
      return NextResponse.json(
        {
          error: "MISSING_FIELDS",
          message: "Topic, Research Problem, and Research Objective are mandatory fields.",
        },
        { status: 400 }
      );
    }

    // 1. Discover verified academic literature via OpenAlex
    let verifiedLiterature: any[] = [];
    try {
      const literatureSearch = await searchWorks({
        query: `${topic.trim()} ${problem.trim()}`.slice(0, 150),
        limit: 5,
        sort: "citations",
      });

      if (literatureSearch?.papers && literatureSearch.papers.length > 0) {
        verifiedLiterature = literatureSearch.papers.map((p) => {
          const leadAuthor = p.authors?.[0] || "Researcher";
          const lastName = leadAuthor.split(" ").pop() || leadAuthor;
          return {
            id: p.openAlexId || p.id,
            citationKey: `${lastName} et al., ${p.year || new Date().getFullYear()}`,
            title: p.title,
            authors: p.authors,
            year: p.year,
            venue: p.venue,
            doi: p.doi,
            sourceUrl: p.sourceUrl,
            verified: true,
          };
        });
      }
    } catch (err) {
      console.warn("OpenAlex literature discovery for generator encountered error:", err);
    }

    const promptParams: PaperGenerationPrompt = {
      topic: topic.trim(),
      problem: problem.trim(),
      objective: objective.trim(),
      field: field?.trim() || "Computer Science / Artificial Intelligence",
      methodology: methodology?.trim() || "Empirical Benchmark & Architectural Formulation",
      targetLengthWords: Number(targetLengthWords) || 3000,
      citationStyle: citationStyle || "APA",
      additionalInstructions: additionalInstructions?.trim(),
      verifiedLiterature,
    };

    // 2. Generate structured 12-section research paper draft grounded in OpenAlex literature
    const draft = await aiService.generateResearchPaper(promptParams);

    // Save to Database
    const saved = await prisma.generatedPaper.create({
      data: {
        userId: session.id,
        prompt: JSON.stringify(promptParams),
        title: draft.title,
        abstract: draft.abstract,
        content: JSON.stringify({
          keywords: draft.keywords,
          sections: draft.sections,
          citations: draft.citations,
        }),
        status: "DRAFT",
        wordCount: draft.wordCount,
        citationStyle: draft.citationStyle,
      },
    });

    return NextResponse.json({
      success: true,
      draftId: saved.id,
      draft: {
        ...draft,
        id: saved.id,
      },
    });
  } catch (error: any) {
    console.error("Paper generation route error:", error);
    return NextResponse.json(
      { error: "GENERATION_FAILED", message: "Failed to generate research paper draft. Please try again." },
      { status: 500 }
    );
  }
}
