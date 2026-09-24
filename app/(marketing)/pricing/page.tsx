"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Check, Zap, Sparkles, ArrowRight, ShieldCheck, HelpCircle } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PRICING_PLANS } from "@/lib/stripe/plans";

export default function PricingPage() {
  const { data: session } = useSession();
  const [interval, setInterval] = useState<"monthly" | "yearly">("yearly");
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    if (!session) {
      window.location.href = "/login?callbackUrl=/pricing";
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interval }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Upgrade error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-brand-500/20">
      <Navbar />

      <main className="flex-1 py-16 md:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="brand" className="px-3 py-1">
            Predictable Academic Pricing
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-black text-foreground tracking-tight">
            Plans Designed for Every Stage of Research
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
            Begin with 5 free lifetime analyses. Upgrade to Pro for unconstrained research depth, deep gap discovery, and multi-study generation.
          </p>

          {/* Toggle */}
          <div className="pt-4 flex items-center justify-center gap-3">
            <span className={`text-sm ${interval === "monthly" ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
              Monthly Billing
            </span>
            <button
              type="button"
              onClick={() => setInterval(interval === "monthly" ? "yearly" : "monthly")}
              className="w-12 h-6 rounded-full bg-secondary p-0.5 transition-colors relative"
            >
              <div
                className={`w-5 h-5 rounded-full bg-brand-500 transition-transform ${
                  interval === "yearly" ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
            <div className="flex items-center gap-1.5">
              <span className={`text-sm ${interval === "yearly" ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
                Yearly Billing
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                Save 58% with yearly billing (over 7 Months Free)
              </span>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Tier */}
          <Card className="p-8 space-y-6 border-border flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-foreground">{PRICING_PLANS.FREE.name}</h3>
                <Badge variant="outline">Starter</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{PRICING_PLANS.FREE.tagline}</p>
              <div className="pt-2">
                <span className="text-5xl font-black text-foreground">₹0</span>
                <span className="text-sm text-muted-foreground ml-2">/ lifetime</span>
              </div>
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-300 font-semibold">
                Exactly 5 Free Lifetime Paper Analyses Included
              </div>
              <ul className="space-y-3 pt-2">
                {PRICING_PLANS.FREE.features.map((feat, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-xs text-foreground font-medium">
                    <Check className="w-4 h-4 text-brand-500 shrink-0 stroke-[2.5]" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Link href="/signup" className="pt-6 block">
              <Button variant="outline" className="w-full h-12 text-sm font-semibold">
                Start Free with 5 Analyses
              </Button>
            </Link>
          </Card>

          {/* Premium Tier */}
          <Card className="p-8 space-y-6 border-brand-500/40 relative shadow-2xl flex flex-col justify-between bg-gradient-to-b from-card via-card to-brand-500/5">
            <div className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-blue-600 text-white text-[11px] font-bold tracking-wide uppercase shadow-md shadow-blue-500/20">
              Most Popular for Academics
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-foreground">{PRICING_PLANS.PREMIUM.name}</h3>
                <Badge variant="brand">Unlimited</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{PRICING_PLANS.PREMIUM.tagline}</p>
              <div className="pt-2">
                <span className="text-5xl font-black text-foreground">
                  {interval === "yearly" ? "₹1,499" : "₹299"}
                </span>
                <span className="text-sm text-muted-foreground ml-2">
                  {interval === "yearly" ? "/ year (billed annually)" : "/ month"}
                </span>
              </div>
              <ul className="space-y-3 pt-2">
                {PRICING_PLANS.PREMIUM.features.map((feat, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-xs text-foreground font-medium">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0 stroke-[2.5]" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-6">
              <Button
                variant="academic"
                className="w-full h-12 text-sm font-semibold gap-2 shadow-lg"
                onClick={handleUpgrade}
                disabled={loading}
              >
                <Zap className="w-4 h-4" />
                {loading ? "Preparing Checkout..." : "Upgrade to Pro"}
              </Button>
              <p className="text-[11px] text-center text-muted-foreground mt-2.5">
                Instant activation. Secure payments powered by Stripe.
              </p>
            </div>
          </Card>
        </div>

        {/* Comparison Feature Table */}
        <div className="max-w-4xl mx-auto space-y-6 pt-10">
          <h2 className="text-2xl font-bold text-center text-foreground">Detailed Feature Comparison</h2>

          <div className="overflow-x-auto rounded-2xl border border-border bg-card">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="p-4 font-semibold text-muted-foreground">Capabilities</th>
                  <th className="p-4 font-semibold text-muted-foreground text-center">Starter Scholar (Free)</th>
                  <th className="p-4 font-semibold text-brand-600 dark:text-brand-400 text-center">PaperLens Pro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  { name: "Lifetime Research Paper Analyses", free: "5 Papers", pro: "Unlimited" },
                  { name: "13-Section Deep Deconstruction", free: "Yes", pro: "Yes" },
                  { name: "Research Gap Discovery Engine", free: "Basic", pro: "Advanced + Severity Score" },
                  { name: "Multi-Study Comparison Matrix", free: "2 Papers", pro: "Up to 5 Papers" },
                  { name: "AI Research Paper Generator", free: "—", pro: "Included (12-Section Drafts)" },
                  { name: "Strategic AI Research Advisor", free: "—", pro: "Unlimited Queries" },
                  { name: "Verified Semantic Scholar & OpenAlex Citations", free: "Yes", pro: "Yes (Deep Crossref Lookups)" },
                  { name: "PDF and DOCX Document Export", free: "—", pro: "One-Click Export" },
                  { name: "Dedicated GPU Compute Queues", free: "Standard", pro: "Priority Tier" },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4 font-medium text-foreground">{row.name}</td>
                    <td className="p-4 text-center text-muted-foreground">{row.free}</td>
                    <td className="p-4 text-center font-bold text-brand-600 dark:text-brand-400">{row.pro}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
