"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  BookOpen,
  GitCompare,
  Search,
  PenTool,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  FileText,
  Zap,
  ExternalLink,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { UpgradeModal } from "@/components/ui/UpgradeModal";

export default function DashboardPage() {
  const { data: session } = useSession();
  const [usageData, setUsageData] = useState<any>(null);
  const [recentAnalyses, setRecentAnalyses] = useState<any[]>([]);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  useEffect(() => {
    fetch("/api/user/usage")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) setUsageData(data);
      })
      .catch(() => {});

    fetch("/api/history")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.analyses) {
          setRecentAnalyses(data.analyses.slice(0, 3));
        }
      })
      .catch(() => {});
  }, []);

  const userName = session?.user?.name || "Scholar";
  const userPlan = usageData?.plan || (session?.user as any)?.plan || "FREE";
  const analysisCount = usageData?.analysisCount ?? ((session?.user as any)?.analysisCount || 0);
  const isPremium = userPlan === "PREMIUM";
  const maxFree = 5;
  const remaining = isPremium ? Infinity : Math.max(0, maxFree - analysisCount);

  // Time-based greeting
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <AppSidebar />

        <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto">
          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                {greeting}, {userName}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Continue your research journey. Your intelligent academic command center is ready.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/analyze">
                <Button variant="academic" className="gap-2 shadow-sm">
                  <BookOpen className="w-4 h-4" />
                  Analyze New Paper
                </Button>
              </Link>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-5 space-y-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Papers Analyzed
              </span>
              <p className="text-2xl font-black text-foreground">{analysisCount}</p>
              <span className="text-[11px] text-brand-600 dark:text-brand-400 font-medium">
                {isPremium ? "Unlimited Available" : `${remaining} lifetime credits left`}
              </span>
            </Card>

            <Card className="p-5 space-y-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Research Comparisons
              </span>
              <p className="text-2xl font-black text-foreground">{usageData?.counts?.comparisons || 0}</p>
              <span className="text-[11px] text-muted-foreground font-medium">Cross-study matrices</span>
            </Card>

            <Card className="p-5 space-y-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Research Gaps Found
              </span>
              <p className="text-2xl font-black text-foreground">{analysisCount * 2}</p>
              <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                Unresolved bottlenecks
              </span>
            </Card>

            <Card className="p-5 space-y-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                AI Papers Generated
              </span>
              <p className="text-2xl font-black text-foreground">{usageData?.counts?.generatedPapers || 0}</p>
              <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">
                12-section drafts
              </span>
            </Card>
          </div>

          {/* Free Lifetime Analysis Progress Card (for FREE users) */}
          {!isPremium && (
            <Card className="p-6 border-blue-500/20 bg-blue-50/60 dark:bg-blue-950/20 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1.5 max-w-xl">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      Lifetime Starter Credits
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground">
                    {remaining} / {maxFree} Free Paper Analyses Remaining
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    You receive 5 free starter analyses to evaluate PaperLens AI. Upgrade to Pro for unlimited paper analyses and deep cross-study comparison.
                  </p>

                  <div className="pt-2 max-w-md">
                    <Progress value={Math.max(0, 5 - analysisCount)} max={5} indicatorClassName="bg-blue-600" />
                  </div>
                </div>

                <div className="shrink-0">
                  <Button
                    variant="academic"
                    size="sm"
                    className="gap-2 shadow-md"
                    onClick={() => setShowUpgradeModal(true)}
                  >
                    <Zap className="w-4 h-4" />
                    Upgrade to Pro
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Quick Action Cards */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-foreground">Quick Research Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/analyze">
                <Card className="p-5 h-full hover:border-blue-500/50 hover:shadow-md transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground">Analyze a Paper</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Upload PDF for 13-section deep deconstruction & gap mapping.
                  </p>
                </Card>
              </Link>

              <Link href="/compare">
                <Card className="p-5 h-full hover:border-blue-500/50 hover:shadow-md transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <GitCompare className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground">Compare Papers</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Matrix comparison across 2 to 5 research studies.
                  </p>
                </Card>
              </Link>

              <Link href="/papers">
                <Card className="p-5 h-full hover:border-blue-500/50 hover:shadow-md transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <Search className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground">Find Similar Research</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Explore 200M+ works via Semantic Scholar & OpenAlex.
                  </p>
                </Card>
              </Link>

              <Link href="/generate">
                <Card className="p-5 h-full hover:border-blue-500/50 hover:shadow-md transition-all group">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <PenTool className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-foreground">Generate Research Paper</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Turn your idea into a 12-section research paper draft.
                  </p>
                </Card>
              </Link>
            </div>
          </div>

          {/* Recent Research and Recommended Papers Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Recent Research */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  Recent Research Activity
                </h2>
                <Link href="/history" className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline">
                  View full history →
                </Link>
              </div>

              {recentAnalyses.length === 0 ? (
                <Card className="p-8 text-center space-y-3">
                  <FileText className="w-8 h-8 text-muted-foreground/50 mx-auto" />
                  <p className="text-sm font-medium text-foreground">No recent paper analyses</p>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    Upload your first research paper to see key findings, methodology scores, and research gaps.
                  </p>
                  <Link href="/analyze">
                    <Button variant="outline" size="sm" className="mt-2">
                      Upload PDF
                    </Button>
                  </Link>
                </Card>
              ) : (
                <div className="space-y-3">
                  {recentAnalyses.map((item) => (
                    <Card key={item.id} className="p-4 hover:border-border transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <h4 className="text-sm font-bold text-foreground line-clamp-1">{item.title}</h4>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span>Status: {item.status}</span>
                            <span>•</span>
                            <span>Confidence: {item.confidenceScore}%</span>
                            <span>•</span>
                            <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <Link href="/analyze">
                          <Button variant="ghost" size="sm" className="text-xs">
                            View Analysis →
                          </Button>
                        </Link>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Recommended Research Papers */}
            <div className="lg:col-span-5 space-y-4">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                Recommended Papers
              </h2>

              <div className="space-y-3">
                {[
                  {
                    title: "FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness",
                    venue: "NeurIPS 2022",
                    citations: "4,320 citations",
                    doi: "10.48550/arXiv.2205.14135",
                  },
                  {
                    title: "BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding",
                    venue: "NAACL 2019",
                    citations: "91,400 citations",
                    doi: "10.18653/v1/N19-1423",
                  },
                  {
                    title: "An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale",
                    venue: "ICLR 2021",
                    citations: "38,700 citations",
                    doi: "10.48550/arXiv.2010.11929",
                  },
                ].map((rec, i) => (
                  <Card key={i} className="p-4 space-y-2">
                    <h4 className="text-xs font-bold text-foreground line-clamp-1">{rec.title}</h4>
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>{rec.venue}</span>
                      <span className="font-semibold text-foreground/80">{rec.citations}</span>
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <a
                        href={`https://doi.org/${rec.doi}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
                      >
                        Source <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                      <Link href="/analyze">
                        <Button variant="outline" size="sm" className="h-7 text-[10px]">
                          Analyze This
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        title="Upgrade to ResearchLens Premium"
        subtitle="Experience unconstrained scientific intelligence."
      />
    </div>
  );
}
