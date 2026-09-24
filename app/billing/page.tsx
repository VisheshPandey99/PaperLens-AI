"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  CreditCard,
  Zap,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Receipt,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PRICING_PLANS } from "@/lib/stripe/plans";

export default function BillingPage() {
  const { data: session } = useSession();
  const [usage, setUsage] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/user/usage")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setUsage(data);
      });
  }, []);

  const isPremium = usage?.plan === "PREMIUM";
  const analysisCount = usage?.analysisCount || 0;
  const maxFree = 5;
  const remaining = isPremium ? Infinity : Math.max(0, maxFree - analysisCount);

  const handlePortal = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Portal error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interval: "monthly" }),
      });
      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Upgrade error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <AppSidebar />

        <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto">
          {/* Header */}
          <div className="border-b border-border/60 pb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Subscription & Usage Billing
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your academic plan, monitor lifetime analyses, and access receipts.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Current Plan Card */}
            <div className="lg:col-span-7 space-y-6">
              <Card className="p-6 md:p-8 space-y-6 shadow-sm border-blue-500/20">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Current Subscription
                    </span>
                    <h2 className="text-2xl font-black text-foreground">
                      {isPremium ? "PaperLens Pro" : "Starter Scholar (Free Tier)"}
                    </h2>
                  </div>
                  <Badge variant={isPremium ? "brand" : "outline"} className="text-xs">
                    {isPremium ? "ACTIVE SUBSCRIPTION" : "5 LIFETIME CREDITS"}
                  </Badge>
                </div>

                {/* Usage telemetry */}
                <div className="p-4 rounded-2xl bg-muted/40 border border-border/80 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-foreground">Research Paper Analyses</span>
                    <span className="font-bold text-brand-600 dark:text-brand-400">
                      {isPremium ? "Unlimited Access" : `${remaining} / ${maxFree} Credits Left`}
                    </span>
                  </div>

                  {!isPremium && (
                    <Progress value={Math.max(0, 5 - analysisCount)} max={5} indicatorClassName="bg-amber-500" />
                  )}

                  <p className="text-[11px] text-muted-foreground">
                    {isPremium
                      ? "You have full unconstrained access to paper analyses, comparison matrices, and paper generation."
                      : `${analysisCount} lifetime starter analyses used. Upgrade to Pro for unlimited usage.`}
                  </p>
                </div>

                {/* Action CTA */}
                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  {isPremium ? (
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto h-11 text-xs font-semibold gap-2"
                      onClick={handlePortal}
                      disabled={loading}
                    >
                      <Receipt className="w-4 h-4" />
                      Manage Subscription & Invoices
                    </Button>
                  ) : (
                    <Button
                      variant="academic"
                      className="w-full sm:w-auto h-11 text-xs font-semibold gap-2 shadow-md"
                      onClick={handleUpgrade}
                      disabled={loading}
                    >
                      <Zap className="w-4 h-4" />
                      Upgrade to PaperLens Pro
                    </Button>
                  )}

                  <Link href="/pricing">
                    <Button variant="ghost" className="text-xs">
                      View All Pricing Plans →
                    </Button>
                  </Link>
                </div>
              </Card>

              {/* Security Banner */}
              <div className="p-4 rounded-2xl border border-border bg-card/60 flex items-center gap-3 text-xs text-muted-foreground">
                <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>
                  All payments are processed securely via Stripe. 256-bit SSL encryption. Cancel anytime with no retention penalties.
                </span>
              </div>
            </div>

            {/* Plan Perks Breakdown */}
            <div className="lg:col-span-5 space-y-4">
              <Card className="p-6 space-y-4 bg-muted/20">
                <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
                  Pro Scholar Privileges
                </h3>
                <ul className="space-y-3">
                  {[
                    "Unlimited Full-Text Paper Analyses",
                    "Deep Research Gap Detection & Severity",
                    "Cross-Paper Matrices (2 to 5 studies)",
                    "12-Section Academic Paper Generator",
                    "AI Research Advisor & Verified Citations",
                    "Export to PDF and Microsoft Word DOCX",
                    "Priority High-Throughput GPU Queues",
                  ].map((perk, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-xs text-foreground font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
