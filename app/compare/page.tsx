"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import {
  GitCompare,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Layers,
  ArrowRight,
  TrendingUp,
  FileText,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default function ComparePage() {
  const { data: session } = useSession();

  const [papersToCompare, setPapersToCompare] = useState([
    {
      id: "p1",
      title: "Attention Is All You Need (Transformer)",
      authors: ["Vaswani et al."],
      text: "Replaces recurrent and convolutional models with multi-head self-attention for sequence modeling.",
    },
    {
      id: "p2",
      title: "Deep Residual Learning for Image Recognition (ResNet)",
      authors: ["He et al."],
      text: "Reformulates deep layer mappings as learning residual functions with skip connections.",
    },
    {
      id: "p3",
      title: "FlashAttention: Fast and Memory-Efficient Exact Attention",
      authors: ["Dao et al."],
      text: "IO-aware exact attention tiling algorithm reducing GPU SRAM-to-HBM memory bandwidth bottlenecks.",
    },
  ]);

  const [isComparing, setIsComparing] = useState(false);
  const [comparisonResult, setComparisonResult] = useState<any>(null);
  const [newTitle, setNewTitle] = useState("");

  const addPaperSlot = () => {
    if (papersToCompare.length >= 5) return;
    setPapersToCompare([
      ...papersToCompare,
      {
        id: `p-${Date.now()}`,
        title: newTitle || `Research Paper ${papersToCompare.length + 1}`,
        authors: ["Lead Author"],
        text: "Empirical investigation into architectural optimization.",
      },
    ]);
    setNewTitle("");
  };

  const removePaper = (id: string) => {
    if (papersToCompare.length <= 2) return;
    setPapersToCompare(papersToCompare.filter((p) => p.id !== id));
  };

  const runComparison = async () => {
    setIsComparing(true);
    try {
      const res = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ papers: papersToCompare }),
      });

      const data = await res.json();
      if (res.ok) {
        setComparisonResult(data.comparison);
      }
    } catch (err) {
      console.error("Comparison failed:", err);
    } finally {
      setIsComparing(false);
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
              Cross-Study Paper Comparison
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Select 2 to 5 scientific studies. Construct side-by-side matrices across algorithms, dataset regimes, and discover cross-paper research gaps.
            </p>
          </div>

          {/* Paper Selector Slots */}
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-foreground">
                Selected Studies ({papersToCompare.length} / 5)
              </span>
              <span className="text-xs text-muted-foreground">Min 2, Max 5 papers</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {papersToCompare.map((paper, idx) => (
                <div
                  key={paper.id}
                  className="p-3.5 rounded-xl border border-border bg-card flex items-start justify-between gap-3 shadow-xs"
                >
                  <div className="space-y-1 overflow-hidden">
                    <span className="text-[10px] uppercase font-bold text-brand-500">Study {idx + 1}</span>
                    <h4 className="text-xs font-bold text-foreground truncate">{paper.title}</h4>
                    <p className="text-[10px] text-muted-foreground truncate">
                      {paper.authors?.join(", ") || "Researchers"}
                    </p>
                  </div>

                  {papersToCompare.length > 2 && (
                    <button
                      onClick={() => removePaper(paper.id)}
                      className="p-1 rounded-lg text-muted-foreground hover:text-destructive hover:bg-muted"
                      title="Remove paper"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {papersToCompare.length < 5 && (
              <div className="flex items-center gap-3 pt-2">
                <Input
                  placeholder="Enter additional paper title to compare..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="h-10 text-xs"
                />
                <Button variant="outline" size="sm" onClick={addPaperSlot} className="shrink-0 gap-1.5 h-10">
                  <Plus className="w-3.5 h-3.5" />
                  Add Study
                </Button>
              </div>
            )}

            <div className="pt-2">
              <Button
                variant="academic"
                size="lg"
                className="w-full sm:w-auto px-8 gap-2 font-semibold shadow-md"
                onClick={runComparison}
                disabled={isComparing}
              >
                <GitCompare className="w-4 h-4" />
                {isComparing ? "Synthesizing Cross-Study Matrix..." : "Generate Comparison Matrix"}
              </Button>
            </div>
          </Card>

          {/* Comparison Results */}
          {comparisonResult && (
            <div className="space-y-8 animate-in fade-in duration-300">
              {/* CROSS-PAPER RESEARCH GAP HIGHLIGHT CARD */}
              <div className="rounded-3xl border-2 border-blue-500/30 bg-blue-50/50 dark:bg-blue-950/20 p-6 md:p-8 space-y-4 shadow-lg">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      Cross-Study Synthesis
                    </span>
                    <h3 className="text-xl font-bold text-foreground">Cross-Paper Research Gap</h3>
                  </div>
                </div>

                <p className="text-sm text-foreground/90 leading-relaxed font-medium">
                  {comparisonResult.crossPaperGap}
                </p>

                <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 pt-2 border-t border-border/40">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>
                    AI-Generated Insight: Extracted across common failure conditions and orthogonal constraints of compared studies.
                  </span>
                </div>
              </div>

              {/* Matrix Table */}
              <Card className="overflow-hidden border-border shadow-md">
                <div className="p-5 border-b border-border/60 flex items-center justify-between">
                  <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                    <GitCompare className="w-4 h-4 text-brand-500" />
                    Comparative Dimension Matrix
                  </h3>
                  <Badge variant="outline">Horizontal Scroll Enabled</Badge>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-border bg-muted/40">
                        <th className="p-4 font-bold text-muted-foreground uppercase tracking-wider min-w-[140px]">
                          Dimension
                        </th>
                        {comparisonResult.papers.map((p: any, i: number) => (
                          <th key={i} className="p-4 font-bold text-foreground min-w-[240px] max-w-[320px]">
                            {p.title}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {[
                        { label: "Research Problem", key: "problem" },
                        { label: "Objectives", key: "objectives" },
                        { label: "Methodology", key: "methodology" },
                        { label: "Dataset & Benchmarks", key: "dataset" },
                        { label: "Algorithms & Loss", key: "algorithms" },
                        { label: "Key Results", key: "results" },
                        { label: "Limitations", key: "limitations" },
                        { label: "Unresolved Gap", key: "researchGap" },
                        { label: "Future Work", key: "futureWork" },
                      ].map((dim, idx) => (
                        <tr key={idx} className="hover:bg-muted/20 transition-colors">
                          <td className="p-4 font-semibold text-foreground bg-muted/20 align-top">
                            {dim.label}
                          </td>
                          {comparisonResult.papers.map((p: any, pIdx: number) => (
                            <td key={pIdx} className="p-4 text-muted-foreground leading-relaxed align-top">
                              {p[dim.key] || "—"}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
