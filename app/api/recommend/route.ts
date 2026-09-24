import { NextRequest, NextResponse } from "next/server";
import { getServerUserSession } from "@/lib/auth/session";
import { aiService } from "@/services/ai/aiService";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerUserSession();
    if (!session) {
      return NextResponse.json({ error: "UNAUTHORIZED", message: "Sign in required." }, { status: 401 });
    }

    const body = await req.json();
    const { topic, gapSummary } = body;

    if (!topic || typeof topic !== "string") {
      return NextResponse.json(
        { error: "INVALID_TOPIC", message: "A research topic is required for the AI Advisor." },
        { status: 400 }
      );
    }

    const advisorOutput = await aiService.adviseResearch(topic, gapSummary || "General research exploration");

    return NextResponse.json({
      success: true,
      advisor: advisorOutput,
    });
  } catch (error: any) {
    console.error("Advisor route error:", error);
    return NextResponse.json(
      { error: "ADVISOR_FAILED", message: "Unable to generate strategic research recommendations." },
      { status: 500 }
    );
  }
}
