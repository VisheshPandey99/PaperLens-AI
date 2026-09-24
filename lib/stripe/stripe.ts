import Stripe from "stripe";

const stripeSecret = process.env.STRIPE_SECRET_KEY;

export const stripe = stripeSecret
  ? new Stripe(stripeSecret, {
      apiVersion: "2024-09-30.acacia" as any,
      appInfo: {
        name: "PaperLens AI",
        version: "1.0.0",
      },
    })
  : null;

export function isStripeConfigured(): boolean {
  return !!stripeSecret && stripeSecret.startsWith("sk_");
}
