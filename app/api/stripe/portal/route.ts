import { NextRequest, NextResponse } from "next/server";
import { getServerUserSession } from "@/lib/auth/session";
import { stripe, isStripeConfigured } from "@/lib/stripe/stripe";
import { prisma } from "@/lib/db/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerUserSession();
    if (!session) {
      return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: { stripeCustomerId: true },
    });

    if (!user?.stripeCustomerId || !isStripeConfigured() || !stripe) {
      // Return direct link back to billing for dev / unconfigured mode
      return NextResponse.json({ url: `${appUrl}/billing` });
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${appUrl}/billing`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (err: any) {
    console.error("Stripe portal error:", err);
    return NextResponse.json({ error: "Failed to open billing portal" }, { status: 500 });
  }
}
