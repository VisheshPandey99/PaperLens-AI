import { getServerSession } from "next-auth";
import { authOptions } from "./authOptions";
import { prisma } from "@/lib/db/prisma";

export interface EnrichedUserSession {
  id: string;
  name: string | null;
  email: string;
  image?: string | null;
  plan: "FREE" | "PREMIUM";
  analysisCount: number;
  remainingAnalyses: number;
  subscriptionStatus: string;
}

export async function getServerUserSession(): Promise<EnrichedUserSession | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      plan: true,
      analysisCount: true,
      subscriptionStatus: true,
    },
  });

  if (!user) return null;

  const plan = (user.plan as "FREE" | "PREMIUM") || "FREE";
  const remaining = plan === "PREMIUM" ? Infinity : Math.max(0, 5 - user.analysisCount);

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,
    plan,
    analysisCount: user.analysisCount,
    remainingAnalyses: remaining,
    subscriptionStatus: user.subscriptionStatus,
  };
}

export async function requireUserSession(): Promise<EnrichedUserSession> {
  const session = await getServerUserSession();
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }
  return session;
}

/**
 * Server-side check for the 5-free-analyses system.
 * Free users receive exactly 5 lifetime analyses starter credits.
 * Returns { allowed: true } or throws/returns { allowed: false, remaining: 0 }
 */
export async function verifyAndConsumeAnalysisCredit(userId: string): Promise<{
  allowed: boolean;
  remaining: number;
  plan: string;
}> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, plan: true, analysisCount: true, subscriptionStatus: true },
  });

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  // Premium users have unlimited paper analysis
  if (user.plan === "PREMIUM" && user.subscriptionStatus === "ACTIVE") {
    // Atomically track usage
    await prisma.user.update({
      where: { id: userId },
      data: { analysisCount: { increment: 1 } },
    });
    return { allowed: true, remaining: Infinity, plan: "PREMIUM" };
  }

  // Free Tier Check: 5 Lifetime analyses limit
  if (user.analysisCount >= 5) {
    return { allowed: false, remaining: 0, plan: "FREE" };
  }

  // Consume 1 analysis credit
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { analysisCount: { increment: 1 } },
    select: { analysisCount: true },
  });

  const remaining = Math.max(0, 5 - updatedUser.analysisCount);
  return { allowed: true, remaining, plan: "FREE" };
}
