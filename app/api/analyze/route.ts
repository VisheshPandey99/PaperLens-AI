import { NextRequest, NextResponse } from "next/server";
import { getServerUserSession, verifyAndConsumeAnalysisCredit } from "@/lib/auth/session";
import { aiService } from "@/services/ai/aiService";
import { findSimilarPapers } from "@/services/research/researchService";
import { prisma } from "@/lib/db/prisma";
import { getWorkById } from "@/lib/openalex/works";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerUserSession();
    if (!session) {
      return NextResponse.json(
        { error: "UNAUTHORIZED", message: "You must be signed in to analyze research papers." },
        { status: 401 }
      );
    }

    const body = await req.json();
    let { extractedText, filename, openAlexId } = body;
    let isMetadataOnly = false;
    let openAlexWork: any = null;

    // Handle OpenAlex paper direct analysis
    if (openAlexId && typeof openAlexId === "string") {
      openAlexWork = await getWorkById(openAlexId);
      if (openAlexWork) {
        if (!extractedText || extractedText.trim().length < 50) {
          isMetadataOnly = true;
          extractedText = `Title: ${openAlexWork.title}
Authors: ${openAlexWork.authors.join(", ")}
Year: ${openAlexWork.year}
Venue / Journal: ${openAlexWork.venue || "Academic Publication"}
DOI: ${openAlexWork.doi || "N/A"}
Topics: ${openAlexWork.topics?.join(", ") || "N/A"}

Abstract:
${openAlexWork.abstract}`;
          filename = `${openAlexWork.title.slice(0, 40).replace(/[^a-zA-Z0-9]/g, "_")}.pdf`;
        }
      }
    }

    if (!extractedText || typeof extractedText !== "string" || extractedText.trim().length < 40) {
      return NextResponse.json(
        { error: "INVALID_TEXT", message: "No sufficient paper text or abstract provided for analysis." },
        { status: 400 }
      );
    }

    // 1. Verify and Consume Free Lifetime Analysis Credit
    const creditCheck = await verifyAndConsumeAnalysisCredit(session.id);
    if (!creditCheck.allowed) {
      return NextResponse.json(
        {
          error: "FREE_LIMIT_EXCEEDED",
          message: "You've used all 5 free research analyses.",
          subMessage: "Upgrade to PaperLens Premium to continue analyzing unlimited papers.",
          remaining: 0,
          plan: creditCheck.plan,
        },
        { status: 403 }
      );
    }

    // 2. Perform AI Structured Analysis via existing service
    const analysis = await aiService.analyzePaper(extractedText, filename);

    // 3. Find verified similar papers from academic repositories via OpenAlex
    const searchTopic = openAlexWork?.topics?.[0] || `${analysis.title} ${analysis.problem}`.slice(0, 150);
    const similarAcademicPapers = await findSimilarPapers(searchTopic, 3);

    const formattedSimilarPapers = similarAcademicPapers.map((sp) => ({
      id: sp.id,
      title: sp.title,
      authors: sp.authors,
      year: sp.year,
      venue: sp.venue,
      doi: sp.doi,
      sourceUrl: sp.sourceUrl,
      citationCount: sp.citationCount,
      isOpenAccess: sp.isOpenAccess,
      relevanceReason: `Shares methodological focus or addresses related domain constraints identified in ${analysis.title}.`,
    }));

    // 4. Persist ResearchPaper and Analysis in Database (avoiding duplicates)
    let paper = null;
    if (openAlexWork) {
      paper = await prisma.researchPaper.findUnique({
        where: { openAlexId: openAlexWork.openAlexId },
      });

      if (!paper) {
        paper = await prisma.researchPaper.create({
          data: {
            openAlexId: openAlexWork.openAlexId,
            title: openAlexWork.title || analysis.title,
            authors: JSON.stringify(openAlexWork.authors || analysis.authors),
            abstract: openAlexWork.abstract || analysis.overview,
            year: openAlexWork.year || new Date().getFullYear(),
            publicationDate: openAlexWork.publicationDate,
            venue: openAlexWork.venue,
            doi: openAlexWork.doi,
            sourceUrl: openAlexWork.sourceUrl,
            pdfUrl: openAlexWork.pdfUrl,
            isOpenAccess: openAlexWork.isOpenAccess ?? false,
            citationCount: openAlexWork.citationCount ?? 0,
            institution: openAlexWork.primaryInstitution,
            topics: JSON.stringify(openAlexWork.topics || []),
            type: openAlexWork.type,
          },
        });
      }
    } else {
      paper = await prisma.researchPaper.create({
        data: {
          title: analysis.title,
          authors: JSON.stringify(analysis.authors),
          abstract: analysis.overview,
          year: new Date().getFullYear(),
          sourceUrl: filename ? `local://${filename}` : undefined,
          isOpenAccess: true,
        },
      });
    }

    const savedAnalysis = await prisma.analysis.create({
      data: {
        userId: session.id,
        paperId: paper.id,
        status: "COMPLETED",
        title: analysis.title,
        authors: JSON.stringify(analysis.authors),
        overview: analysis.overview,
        problem: analysis.problem,
        objectives: analysis.objectives,
        methodology: analysis.methodology,
        dataset: analysis.dataset,
        results: analysis.results,
        findings: analysis.findings,
        limitations: analysis.limitations,
        researchGap: analysis.researchGap,
        futureWork: analysis.futureWork,
        recommendation: analysis.recommendation,
        confidenceScore: analysis.confidenceScore,
        gapProminence: analysis.gapProminence,
        similarPapers: JSON.stringify(formattedSimilarPapers),
      },
    });

    return NextResponse.json({
      success: true,
      analysisId: savedAnalysis.id,
      paperId: paper.id,
      isMetadataOnly,
      metadataNotice: isMetadataOnly
        ? "Full-text analysis is unavailable. This analysis is based on the available paper metadata and abstract."
        : undefined,
      analysis: {
        ...analysis,
        id: savedAnalysis.id,
        similarPapers: formattedSimilarPapers,
      },
      remainingAnalyses: creditCheck.remaining,
      plan: creditCheck.plan,
    });
  } catch (error: any) {
    console.error("Paper analysis route error:", error);
    return NextResponse.json(
      {
        error: "ANALYSIS_FAILED",
        message: "Our AI service encountered an unexpected error while processing this paper. Please try again.",
      },
      { status: 500 }
    );
  }
}
