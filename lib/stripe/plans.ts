export interface PricingPlan {
  id: "FREE" | "PREMIUM";
  name: string;
  tagline: string;
  priceMonthly: number; // in INR
  priceYearly: number; // in INR (equivalent per month or total per year)
  currencySymbol: string;
  priceMonthlyUSD: number;
  priceYearlyUSD: number;
  features: string[];
  ctaText: string;
  isPopular?: boolean;
}

export const PRICING_PLANS: Record<"FREE" | "PREMIUM", PricingPlan> = {
  FREE: {
    id: "FREE",
    name: "Starter Scholar",
    tagline: "Ideal for individual researchers, graduate students, and initial paper exploration.",
    priceMonthly: 0,
    priceYearly: 0,
    currencySymbol: "₹",
    priceMonthlyUSD: 0,
    priceYearlyUSD: 0,
    features: [
      "5 Lifetime Research Paper Analyses",
      "Executive Abstract & Overview Summaries",
      "Semantic Scholar & OpenAlex Paper Search",
      "Basic 2-Paper Comparison Matrix",
      "Community Research Library Access",
      "Standard Web-based Reading Interface",
    ],
    ctaText: "Start Free",
  },
  PREMIUM: {
    id: "PREMIUM",
    name: "PaperLens Pro",
    tagline: "For professors, PhD candidates, research labs, and academic institutions demanding maximum depth.",
    priceMonthly: 299, // ₹299/mo
    priceYearly: 1499, // ₹1,499/yr (Save 58% ~ over 7 months free)
    currencySymbol: "₹",
    priceMonthlyUSD: 4,
    priceYearlyUSD: 19,
    features: [
      "Unlimited Research Paper Analyses",
      "Deep Research Gap Detection Engine",
      "AI Research Advisor & Strategic Queries",
      "Multi-Paper Comparison (up to 5 studies)",
      "AI Research Paper Generator (12-Section Drafts)",
      "Automated Similar-Paper Recommendation",
      "Interactive Draft Editor with AI Rewriting",
      "Export to High-Resolution PDF & Formatted DOCX",
      "Verified Citation Verification & Crossref Lookups",
      "Priority API Processing & Dedicated GPU Queues",
    ],
    ctaText: "Upgrade to Pro",
    isPopular: true,
  },
};
