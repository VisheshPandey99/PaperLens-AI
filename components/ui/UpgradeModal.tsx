"use client";

import React from "react";
import Link from "next/link";
import { Check, Sparkles, X, ShieldAlert, ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
}

export function UpgradeModal({
  isOpen,
  onClose,
  title = "Your 5 free research analyses are complete.",
  subtitle = "Continue your research journey with PaperLens Premium.",
}: UpgradeModalProps) {
  const [loading, setLoading] = React.useState(false);

  if (!isOpen) return null;

  const handleUpgrade = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interval: "monthly" }),
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg rounded-2xl border border-border/80 bg-card p-6 md:p-8 shadow-2xl animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-lg p-1 text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon & Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-semibold">
              <ShieldAlert className="w-3.5 h-3.5" />
              Lifetime Starter Limit Reached
            </div>
            <h3 className="text-xl font-bold text-foreground mt-1">{title}</h3>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
          {subtitle} You have unlocked all initial insights from your 5 starter analyses. Upgrade to Pro for unconstrained research depth.
        </p>

        {/* Benefits Card */}
        <div className="rounded-xl border border-border/80 bg-muted/40 p-4 mb-6 space-y-2.5">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
            Included with PaperLens Pro:
          </div>
          {[
            "Unlimited Full-Text Paper Analyses",
            "Advanced Research Gap Discovery & Severity Scoring",
            "Multi-Study Comparison Matrix (Up to 5 papers)",
            "AI Research Paper Generator (12-Section Academic Drafts)",
            "Strategic AI Research Advisor & Verified Citations",
            "Export to Formatted Academic PDF & DOCX",
          ].map((benefit, i) => (
            <div key={i} className="flex items-center gap-2.5 text-xs text-foreground font-medium">
              <div className="w-4 h-4 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </div>
              <span>{benefit}</span>
            </div>
          ))}
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Button
            variant="academic"
            className="w-full sm:flex-1 h-11 text-sm font-semibold"
            onClick={handleUpgrade}
            disabled={loading}
          >
            {loading ? (
              "Redirecting to Checkout..."
            ) : (
              <>
                <Zap className="w-4 h-4 mr-2" />
                Upgrade to Premium
              </>
            )}
          </Button>

          <Link href="/pricing" className="w-full sm:w-auto" onClick={onClose}>
            <Button variant="outline" className="w-full h-11 text-sm">
              View Plans
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
        </div>

        <p className="text-[11px] text-center text-muted-foreground mt-4">
          Cancel anytime. Backed by institutional-grade SSL encryption & Stripe security.
        </p>
      </div>
    </div>
  );
}
