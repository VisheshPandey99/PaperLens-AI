import { NextRequest, NextResponse } from "next/server";
import { getServerUserSession } from "@/lib/auth/session";
import { stripe, isStripeConfigured } from "@/lib/stripe/stripe";
import { prisma } from "@/lib/db/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerUserSession();
    if (!session) {
      return NextResponse.json({ error: "UNAUTHORIZED", message: "Please log in first." }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { interval = "monthly" } = body;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    // 1. Live Stripe Mode
    if (isStripeConfigured() && stripe) {
      const priceId =
        interval === "yearly"
          ? process.env.NEXT_PUBLIC_STRIPE_PREMIUM_YEARLY_PRICE_ID || "price_premium_yearly"
          : process.env.NEXT_PUBLIC_STRIPE_PREMIUM_MONTHLY_PRICE_ID || "price_premium_monthly";

      const checkoutSession = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "subscription",
        billing_address_collection: "auto",
        customer_email: session.email,
        line_items: [
          {
            price_data: {
              currency: "inr",
              product_data: {
                name: "PaperLens AI Premium",
                description: "Unlimited paper analysis, research gap engine, AI generator & deep literature search.",
              },
              unit_amount: interval === "yearly" ? 149900 : 29900, // in paise (₹1,499 / ₹299)
              recurring: {
                interval: interval === "yearly" ? "year" : "month",
              },
            },
            quantity: 1,
          },
        ],
        metadata: {
          userId: session.id,
          plan: "PREMIUM",
        },
        success_url: `${appUrl}/billing?success=true&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${appUrl}/pricing?canceled=true`,
      });

      return NextResponse.json({ url: checkoutSession.url });
    }

    // 2. Local / Development Simulation Mode (Enables immediate full testing when Stripe key is not yet set)
    console.log("Stripe key not present: executing simulated developer upgrade for user:", session.email);

    await prisma.user.update({
      where: { id: session.id },
      data: {
        plan: "PREMIUM",
        subscriptionStatus: "ACTIVE",
        stripeCustomerId: `cus_dev_${session.id.slice(0, 8)}`,
        stripeSubscriptionId: `sub_dev_${Date.now()}`,
      },
    });

    return NextResponse.json({
      url: `${appUrl}/billing?success=true&simulated=true`,
      simulated: true,
      message: "Development Mode: Upgraded to PaperLens Premium successfully!",
    });
  } catch (error: any) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json({ error: "Failed to initiate checkout session" }, { status: 500 });
  }
}
