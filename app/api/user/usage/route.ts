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

    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: {
        id: true,
        plan: true,
        analysisCount: true,
        subscriptionStatus: true,
        stripeCustomerId: true,
        stripeCurrentPeriodEnd: true,
        _count: {
          select: {
            analyses: true,
            generatedPapers: true,
            comparisons: true,
            savedPapers: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "USER_NOT_FOUND" }, { status: 404 });
    }

    const plan = user.plan || "FREE";
    const remaining = plan === "PREMIUM" ? Infinity : Math.max(0, 5 - user.analysisCount);

    return NextResponse.json({
      plan,
      analysisCount: user.analysisCount,
      maxFreeAnalyses: 5,
      remainingAnalyses: remaining,
      subscriptionStatus: user.subscriptionStatus,
      counts: {
        analyses: user._count.analyses,
        generatedPapers: user._count.generatedPapers,
        comparisons: user._count.comparisons,
        savedPapers: user._count.savedPapers,
      },
    });
  } catch (error) {
    console.error("Usage fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch usage telemetry" }, { status: 500 });
  }
}
