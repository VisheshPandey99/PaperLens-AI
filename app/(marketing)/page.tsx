"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  GitCompare,
  Search,
  PenTool,
  CheckCircle2,
  ChevronRight,
  Shield,
  Layers,
  Zap,
  TrendingUp,
  FileText,
  FileCheck,
  HelpCircle,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PRICING_PLANS } from "@/lib/stripe/plans";

export default function LandingPage() {
  const [billingInterval, setBillingInterval] = useState<"monthly" | "yearly">("yearly");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-brand-500/20">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden academic-grid border-b border-border/60">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-500/10 via-sky-400/5 to-transparent blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-500/20 bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 text-xs font-semibold shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>5 FREE PAPER ANALYSES INCLUDED</span>
                <span className="w-1 h-1 rounded-full bg-blue-400" />
                <span className="text-[11px] opacity-80">No credit card required</span>
              </div>

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]">
                Research Smarter with{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-600 dark:from-blue-400 dark:to-sky-300">
                  AI Intelligence
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Analyze research papers, discover hidden research gaps, compare studies and generate research-ready drafts — all in one intelligent workspace.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link href="/signup" className="w-full sm:w-auto">
                  <Button variant="academic" size="lg" className="w-full sm:w-auto gap-2 shadow-lg shadow-blue-500/20">
                    Start Researching Free
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>

                <Link href="#features" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Explore Features
                  </Button>
                </Link>
              </div>

              {/* Academic Trust indicators */}
              <div className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Verified Semantic Citations</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Multi-Paper Synthesis</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Zero Hallucination Protocol</span>
                </div>
              </div>
            </div>

            {/* Right Animated AI / Research Visual */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Floating ambient element */}
                <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-500/15 to-sky-500/10 rounded-3xl blur-xl opacity-75" />

                <Card className="relative glass-panel border-border/80 p-6 shadow-2xl rounded-3xl space-y-5 overflow-hidden">
                  {/* Top Bar simulating document analysis */}
                  <div className="flex items-center justify-between border-b border-border/60 pb-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 flex items-center justify-center">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-foreground">Transformer_Scalability.pdf</p>
                        <p className="text-[10px] text-muted-foreground">NeurIPS 2023 • 14 Pages Extracted</p>
                      </div>
                    </div>
                    <Badge variant="success" className="text-[10px] gap-1 py-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                      AI Verified
                    </Badge>
                  </div>

                  {/* Research Gap Highlight Card */}
                  <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5 uppercase tracking-wide">
                        <TrendingUp className="w-3.5 h-3.5" />
                        Discovered Research Gap
                      </span>
                      <span className="text-[10px] font-semibold text-muted-foreground">Prominence: 88%</span>
                    </div>
                    <p className="text-xs text-foreground/90 font-medium leading-relaxed">
                      &quot;Quadratic attention memory limits real-time edge processing on IoT devices below a 5W power envelope.&quot;
                    </p>
                  </div>

                  {/* Matrix comparison snippet */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="rounded-xl border border-border bg-card/80 p-3 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground">Methodology Rigor</span>
                      <p className="text-base font-bold text-foreground">94 / 100</p>
                      <div className="w-full h-1 bg-secondary rounded-full overflow-hidden">
                        <div className="w-[94%] h-full bg-blue-600 rounded-full" />
                      </div>
                    </div>

                    <div className="rounded-xl border border-border bg-card/80 p-3 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground">Verified References</span>
                      <p className="text-base font-bold text-foreground">38 Papers</p>
                      <div className="w-full h-1 bg-secondary rounded-full overflow-hidden">
                        <div className="w-[85%] h-full bg-sky-500 rounded-full" />
                      </div>
                    </div>
                  </div>

                  {/* AI Recommendation snippet */}
                  <div className="rounded-xl border border-blue-500/20 bg-blue-50/60 dark:bg-blue-950/30 p-3 flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-foreground">Suggested Strategic Next Step</p>
                      <p className="text-[11px] text-muted-foreground leading-normal mt-0.5">
                        Test sparse windowed self-attention with FP8 quantization across PlantVillage benchmarks.
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Academic Institutions */}
      <section className="py-12 border-b border-border/60 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Trusted by researchers, doctoral scholars, and faculty from leading institutions
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14 opacity-70 grayscale hover:grayscale-0 transition-all">
            {["MIT CSAIL", "Stanford AI Lab", "Oxford University", "Cambridge", "ETH Zürich", "CERN", "Max Planck Institute"].map(
              (inst, i) => (
                <span key={i} className="text-sm font-semibold tracking-wide text-foreground/80">
                  {inst}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section id="features" className="py-20 md:py-28 border-b border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <Badge variant="brand" className="px-3 py-1">
              Core Capabilities
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Built for Serious Academic Discovery
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
              Generic chatbots generate shallow summaries with fabricated citations. PaperLens AI executes deep structural decomposition, identifies scientific gaps, and maps verifiable literature.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <Card className="p-7 space-y-4 hover:border-blue-500/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground">13-Section Paper Deconstruction</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Upload any PDF. Extract methodologies, datasets, benchmarks, limitations, and future research paths into clean, structured schemas validated with Zod.
              </p>
              <Link href="/analyze" className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 pt-2">
                Analyze a paper <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </Card>

            {/* Feature 2 */}
            <Card className="p-7 space-y-4 hover:border-blue-500/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 flex items-center justify-center">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Research Gap Discovery Engine</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Pinpoint exactly what remains unsolved in existing literature. Generate scientifically grounded research questions and suggested methodologies for subsequent studies.
              </p>
              <Link href="/analyze" className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 pt-2">
                Explore gap engine <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </Card>

            {/* Feature 3 */}
            <Card className="p-7 space-y-4 hover:border-blue-500/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 flex items-center justify-center">
                <GitCompare className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Cross-Paper Comparison Matrix</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Select 2 to 5 research papers. Compare problem statements, algorithms, dataset scales, and synthesis barriers side-by-side in an interactive tabular matrix.
              </p>
              <Link href="/compare" className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 pt-2">
                Compare studies <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </Card>

            {/* Feature 4 */}
            <Card className="p-7 space-y-4 hover:border-blue-500/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 flex items-center justify-center">
                <PenTool className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground">AI Research Paper Generator</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Transform research ideas into complete 12-section research paper drafts. Structured from Abstract through Expected Results, with an interactive section editor and verified citations.
              </p>
              <Link href="/generate" className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 pt-2">
                Generate draft <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </Card>

            {/* Feature 5 */}
            <Card className="p-7 space-y-4 hover:border-blue-500/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 flex items-center justify-center">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground">Academic Research Hub</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Query over 200 million papers through Semantic Scholar, OpenAlex, and Crossref. Filter by open-access availability, citation volume, and publication venue.
              </p>
              <Link href="/papers" className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 pt-2">
                Search repository <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </Card>

            {/* Feature 6 */}
            <Card className="p-7 space-y-4 hover:border-blue-500/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 flex items-center justify-center">
                <FileCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground">PDF & DOCX Export</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Export generated paper drafts and comparative synthesis reports directly to formatted, peer-review-ready PDF and editable Microsoft Word DOCX formats with single-click ease.
              </p>
              <Link href="/generate" className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 pt-2">
                Try exports <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 md:py-28 bg-muted/20 border-b border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <Badge variant="brand">Streamlined Workflow</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              From Complex PDF to Actionable Research in Seconds
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Upload & Extract",
                desc: "Drop any academic PDF up to 25MB. Text, tables, equations, and metadata are cleanly extracted.",
              },
              {
                step: "02",
                title: "AI Deconstruction",
                desc: "13 core scientific dimensions are analyzed, establishing methodology rigor and dataset boundaries.",
              },
              {
                step: "03",
                title: "Research Gap Mapping",
                desc: "Our engine highlights unresolved research limitations and suggests targeted hypotheses to investigate.",
              },
              {
                step: "04",
                title: "Draft & Literature Search",
                desc: "Generate full research drafts supported by verified references from Semantic Scholar and OpenAlex.",
              },
            ].map((st, i) => (
              <div key={i} className="relative space-y-3">
                <span className="text-4xl font-black text-brand-500/30 font-mono">{st.step}</span>
                <h3 className="text-lg font-bold text-foreground">{st.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 md:py-28 border-b border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <Badge variant="brand">Simple & Transparent</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              Invest in Research Clarity
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Get started with 5 lifetime free analyses. Upgrade to Pro when you need unlimited power.
            </p>

            {/* Monthly / Yearly Billing Toggle */}
            <div className="pt-4 flex items-center justify-center gap-3">
              <span className={`text-sm ${billingInterval === "monthly" ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
                Monthly Billing
              </span>
              <button
                type="button"
                onClick={() => setBillingInterval(billingInterval === "monthly" ? "yearly" : "monthly")}
                className="w-12 h-6 rounded-full bg-secondary p-0.5 transition-colors relative"
              >
                <div
                  className={`w-5 h-5 rounded-full bg-brand-500 transition-transform ${
                    billingInterval === "yearly" ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
              <div className="flex items-center gap-1.5">
                <span className={`text-sm ${billingInterval === "yearly" ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
                  Yearly Billing
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                  Save 58%
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <Card className="p-8 space-y-6 border-border flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-foreground">{PRICING_PLANS.FREE.name}</h3>
                  <Badge variant="outline">Lifetime Starter</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{PRICING_PLANS.FREE.tagline}</p>
                <div className="pt-2">
                  <span className="text-4xl font-extrabold text-foreground">₹0</span>
                  <span className="text-sm text-muted-foreground ml-2">/ forever</span>
                </div>
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-300 font-semibold">
                  Includes 5 Free Lifetime Research Paper Analyses
                </div>
                <ul className="space-y-2.5 pt-2">
                  {PRICING_PLANS.FREE.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-xs text-foreground font-medium">
                      <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/signup" className="pt-6 block">
                <Button variant="outline" className="w-full h-11 text-sm font-semibold">
                  Start Free (5 Analyses)
                </Button>
              </Link>
            </Card>

            {/* Premium Plan */}
            <Card className="p-8 space-y-6 border-brand-500/40 relative shadow-xl flex flex-col justify-between bg-gradient-to-b from-card via-card to-brand-500/5">
              <div className="absolute -top-3 right-6 px-3 py-1 rounded-full bg-blue-600 text-white text-[11px] font-bold tracking-wide uppercase shadow-md shadow-blue-500/20">
                Recommended for Labs
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-foreground">{PRICING_PLANS.PREMIUM.name}</h3>
                  <Badge variant="brand">Unlimited</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{PRICING_PLANS.PREMIUM.tagline}</p>
                <div className="pt-2">
                  <span className="text-4xl font-extrabold text-foreground">
                    {billingInterval === "yearly" ? "₹1,499" : "₹299"}
                  </span>
                  <span className="text-sm text-muted-foreground ml-2">
                    {billingInterval === "yearly" ? "/ year (Save ₹2,089)" : "/ month"}
                  </span>
                </div>
                <ul className="space-y-2.5 pt-2">
                  {PRICING_PLANS.PREMIUM.features.map((feat, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-xs text-foreground font-medium">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link href="/signup" className="pt-6 block">
                <Button variant="academic" className="w-full h-11 text-sm font-semibold gap-2 shadow-md">
                  <Zap className="w-4 h-4" />
                  Upgrade to Pro
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 border-b border-border/60 bg-muted/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <Badge variant="brand">Frequently Asked Questions</Badge>
            <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
              Everything You Need to Know
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "How do the 5 free paper analyses work?",
                a: "Every new user receives 5 lifetime starter analyses. You can upload and deconstruct up to 5 complete research papers with full 13-section analysis, methodology scores, and gap identification. After using all 5, you can upgrade to PaperLens Pro for unlimited analyses.",
              },
              {
                q: "Does PaperLens AI fabricate scientific citations?",
                a: "Never. We enforce a Zero Hallucination Citation Protocol. All literature links and references are cross-referenced directly with scientific repositories including Semantic Scholar, OpenAlex, and Crossref with verified DOIs and landing pages.",
              },
              {
                q: "What does the AI Research Paper Generator create?",
                a: "It produces a structured academic draft containing Title, Abstract, Introduction, Literature Review, Research Questions, Methodology, and Expected Results. Generated outcomes are explicitly marked as 'Expected Results' rather than fabricated empirical data, allowing researchers to build upon a disciplined foundation.",
              },
              {
                q: "Can I cancel my subscription at any time?",
                a: "Yes. You can cancel your subscription at any time with a single click via our Stripe Customer Portal in your billing dashboard without penalty or hidden conditions.",
              },
            ].map((item, index) => (
              <Card key={index} className="overflow-hidden">
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-foreground text-sm hover:text-brand-500 transition-colors"
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200 ${
                      openFaq === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-5 pb-5 pt-1 text-sm text-muted-foreground leading-relaxed border-t border-border/40">
                    {item.a}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final High-Converting CTA */}
      <section className="py-20 relative overflow-hidden bg-gradient-to-b from-background to-brand-500/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <Badge variant="brand" className="px-3 py-1">
            Get Started Today
          </Badge>
          <h2 className="text-3xl sm:text-5xl font-black text-foreground tracking-tight">
            Read Smarter. Research Deeper. Create Better.
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">
            Join thousands of academics, researchers, and students who have accelerated their scientific workflow with PaperLens AI.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button variant="academic" size="lg" className="w-full sm:w-auto gap-2 shadow-xl">
                Claim Your 5 Free Analyses
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Compare All Plans
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
