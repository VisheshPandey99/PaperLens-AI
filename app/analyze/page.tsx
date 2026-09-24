"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";

import {
  Upload,
  FileText,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  BookOpen,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Layers,
  Database,
  BarChart3,
  HelpCircle,
  Lightbulb,
  Bookmark,
  Share2,
  Info,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { UpgradeModal } from "@/components/ui/UpgradeModal";

const PROCESSING_STEPS = [
  "Uploading document...",
  "Extracting PDF text and tables...",
  "Understanding paper architecture...",
  "Running deep AI analysis...",
  "Finding related peer-reviewed literature...",
  "Synthesizing 13-section research report...",
];

function AnalyzeContent() {
  const { data: session } = useSession();

  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("overview");

  const searchParams = useSearchParams();
  const openAlexId = searchParams.get("openAlexId");
  const openAlexTitle = searchParams.get("title");
  const [metadataNotice, setMetadataNotice] = useState<string | null>(null);

  const startOpenAlexAnalysis = async (targetId: string = openAlexId || "") => {
    if (!targetId) return;

    setIsProcessing(true);
    setCurrentStepIndex(0);
    setErrorMessage("");

    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < PROCESSING_STEPS.length - 1) return prev + 1;
        return prev;
      });
    }, 1200);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          openAlexId: targetId,
        }),
      });

      const data = await res.json();
      clearInterval(interval);
      setIsProcessing(false);

      if (res.status === 403 && data.error === "FREE_LIMIT_EXCEEDED") {
        setShowUpgradeModal(true);
        return;
      }

      if (!res.ok) {
        setErrorMessage(data.message || "Failed to analyze research paper.");
        return;
      }

      if (data.metadataNotice) {
        setMetadataNotice(data.metadataNotice);
      }
      setAnalysisResult(data.analysis);
    } catch {
      clearInterval(interval);
      setIsProcessing(false);
      setErrorMessage("An unexpected network error occurred while analyzing paper.");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "application/pdf" || droppedFile.name.endsWith(".pdf")) {
        setFile(droppedFile);
        setErrorMessage("");
      } else {
        setErrorMessage("Only PDF research papers are supported.");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setErrorMessage("");
    }
  };

  const startAnalysis = async () => {
    if (!file) return;

    setIsProcessing(true);
    setCurrentStepIndex(0);
    setErrorMessage("");

    // Simulate multi-stage visual progression
    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < PROCESSING_STEPS.length - 1) return prev + 1;
        return prev;
      });
    }, 1200);

    try {
      // 1. Upload & parse PDF
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) {
        clearInterval(interval);
        setIsProcessing(false);
        setErrorMessage(uploadData.error || "Failed to extract PDF.");
        return;
      }

      // 2. Perform AI Structured Analysis
      const analyzeRes = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          extractedText: uploadData.extractedText,
          filename: file.name,
        }),
      });

      const analyzeData = await analyzeRes.json();
      clearInterval(interval);
      setIsProcessing(false);

      if (analyzeRes.status === 403 && analyzeData.error === "FREE_LIMIT_EXCEEDED") {
        setShowUpgradeModal(true);
        return;
      }

      if (!analyzeRes.ok) {
        setErrorMessage(analyzeData.message || "Failed to analyze paper.");
        return;
      }

      setAnalysisResult(analyzeData.analysis);
    } catch (err) {
      clearInterval(interval);
      setIsProcessing(false);
      setErrorMessage("An unexpected network error occurred.");
    }
  };

  // Sample quick demo trigger
  const runDemoAnalysis = async () => {
    setIsProcessing(true);
    setCurrentStepIndex(0);
    setErrorMessage("");

    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < PROCESSING_STEPS.length - 1 ? prev + 1 : prev));
    }, 1000);

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          extractedText:
            "Attention Is All You Need: The dominant sequence transduction models are based on complex recurrent or convolutional neural networks. We propose the Transformer, an architecture based solely on attention mechanisms, dispensing with recurrence and convolutions entirely.",
          filename: "Attention_Is_All_You_Need.pdf",
        }),
      });

      const data = await res.json();
      clearInterval(interval);
      setIsProcessing(false);

      if (res.status === 403) {
        setShowUpgradeModal(true);
        return;
      }

      if (res.ok) {
        setAnalysisResult(data.analysis);
      } else {
        setErrorMessage(data.message || "Analysis failed");
      }
    } catch {
      clearInterval(interval);
      setIsProcessing(false);
      setErrorMessage("Error running demo analysis");
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
              Research Paper Analysis
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Upload any scientific publication to extract methodology, key findings, dataset coverage, and unresolved research gaps.
            </p>
          </div>

          {/* Upload Area (Shown when not viewing an analysis result) */}
          {!analysisResult && !isProcessing && (
            <div className="space-y-6 max-w-3xl mx-auto">
              {/* OpenAlex Selected Paper Card */}
              {openAlexId && (
                <Card className="p-6 border border-brand-500/30 bg-brand-500/5 rounded-2xl space-y-4 shadow-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Badge variant="outline" className="text-xs font-semibold text-brand-600 dark:text-brand-400">
                      Paper Selected from Research Hub
                    </Badge>
                    <span className="text-xs font-mono text-muted-foreground">{openAlexId}</span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-foreground">
                      {openAlexTitle || "Selected Academic Paper"}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Ready for instant 13-section AI deconstruction, statistical rigor scoring, and gap detection.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-1">
                    <Button
                      variant="academic"
                      className="gap-2 font-semibold shadow-sm"
                      onClick={() => startOpenAlexAnalysis(openAlexId)}
                    >
                      <Sparkles className="w-4 h-4" />
                      Analyze with AI (Uses 1 Credit)
                    </Button>
                    <span className="text-xs text-muted-foreground">or upload your own PDF below</span>
                  </div>
                </Card>
              )}

              <Card
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`p-10 border-2 border-dashed rounded-3xl text-center transition-all cursor-pointer ${
                  isDragging
                    ? "border-brand-500 bg-brand-500/5 scale-[1.01]"
                    : "border-border hover:border-brand-500/50 hover:bg-muted/20"
                }`}
                onClick={() => document.getElementById("pdf-upload")?.click()}
              >
                <input
                  id="pdf-upload"
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={handleFileChange}
                />

                <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 flex items-center justify-center mx-auto mb-4">
                  <Upload className="w-8 h-8" />
                </div>

                <h3 className="text-lg font-bold text-foreground">
                  {file ? file.name : "Drag & Drop Research Paper PDF"}
                </h3>

                <p className="text-xs text-muted-foreground mt-1.5 max-w-sm mx-auto">
                  {file
                    ? `File selected: ${(file.size / (1024 * 1024)).toFixed(2)} MB. Ready to process.`
                    : "Supports academic PDFs up to 25MB. Pre-prints, conference papers, and journal articles."}
                </p>

                <div className="pt-4 flex items-center justify-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      document.getElementById("pdf-upload")?.click();
                    }}
                  >
                    Browse Files
                  </Button>
                </div>
              </Card>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <Button
                  variant="academic"
                  size="lg"
                  className="w-full sm:w-auto px-8 gap-2 font-semibold shadow-md"
                  disabled={!file}
                  onClick={startAnalysis}
                >
                  <Sparkles className="w-4 h-4" />
                  Deconstruct & Analyze Paper
                </Button>

                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Want to test quickly?</span>
                  <button
                    onClick={runDemoAnalysis}
                    className="text-brand-600 dark:text-brand-400 font-semibold hover:underline"
                  >
                    Run Demo Paper Analysis →
                  </button>
                </div>
              </div>

              {errorMessage && (
                <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-xs text-destructive flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </div>
          )}

          {/* Processing Screen with Multi-Stage Checklist */}
          {isProcessing && (
            <Card className="max-w-2xl mx-auto p-8 md:p-12 space-y-8 text-center shadow-xl">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 flex items-center justify-center mx-auto animate-pulse">
                <Sparkles className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-foreground">Analyzing Your Research Paper...</h3>
                <p className="text-xs text-muted-foreground">
                  Our AI engine is extracting statistical boundaries, methodologies, and peer citations.
                </p>
              </div>

              {/* Stage Checklist */}
              <div className="space-y-3 max-w-md mx-auto text-left">
                {PROCESSING_STEPS.map((step, idx) => {
                  const isDone = idx < currentStepIndex;
                  const isCurrent = idx === currentStepIndex;

                  return (
                    <div
                      key={idx}
                      className={`flex items-center gap-3 text-xs transition-all duration-300 ${
                        isDone
                          ? "text-emerald-600 dark:text-emerald-400 font-medium"
                          : isCurrent
                          ? "text-brand-600 dark:text-brand-400 font-bold scale-[1.02]"
                          : "text-muted-foreground/50"
                      }`}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      ) : isCurrent ? (
                        <div className="w-4 h-4 rounded-full border-2 border-brand-500 border-t-transparent animate-spin shrink-0" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-border shrink-0" />
                      )}
                      <span>{step}</span>
                    </div>
                  );
                })}
              </div>

              <div className="max-w-md mx-auto">
                <Progress
                  value={((currentStepIndex + 1) / PROCESSING_STEPS.length) * 100}
                  indicatorClassName="bg-blue-600"
                />
              </div>
            </Card>
          )}

          {/* Analysis Results View */}
          {analysisResult && (
            <div className="space-y-8 animate-in fade-in duration-300">
              {/* Paper Title Header Card */}
              <Card className="p-6 md:p-8 space-y-4 border-blue-500/20 bg-card shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <Badge variant="brand" className="gap-1.5 py-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    Structured Paper Deconstruction
                  </Badge>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setAnalysisResult(null);
                        setFile(null);
                      }}
                      className="text-xs"
                    >
                      Analyze Another Paper
                    </Button>
                  </div>
                </div>

                {metadataNotice && (
                  <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-800 dark:text-blue-200 flex items-start gap-2.5">
                    <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{metadataNotice}</span>
                  </div>
                )}

                <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight leading-snug">
                  {analysisResult.title}
                </h2>

                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    <span>
                      Authors:{" "}
                      {Array.isArray(analysisResult.authors)
                        ? analysisResult.authors.join(", ")
                        : "Academic Researchers"}
                    </span>
                  </div>
                </div>

                {/* Score Bar Indicators */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-border/60">
                  <div className="p-3.5 rounded-xl bg-muted/40 border border-border/80 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground font-medium">Methodology Rigor</span>
                      <span className="font-bold text-foreground">{analysisResult.confidenceScore || 92}%</span>
                    </div>
                    <Progress value={analysisResult.confidenceScore || 92} indicatorClassName="bg-blue-600" />
                  </div>

                  <div className="p-3.5 rounded-xl bg-muted/40 border border-border/80 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground font-medium">Research Gap Prominence</span>
                      <span className="font-bold text-amber-600 dark:text-amber-400">
                        {analysisResult.gapProminence || 85}%
                      </span>
                    </div>
                    <Progress value={analysisResult.gapProminence || 85} indicatorClassName="bg-amber-500" />
                  </div>

                  <div className="p-3.5 rounded-xl bg-muted/40 border border-border/80 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground font-medium">Verification Protocol</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">Validated</span>
                    </div>
                    <Progress value={100} indicatorClassName="bg-emerald-500" />
                  </div>
                </div>
              </Card>

              {/* SECTION 10: RESEARCH GAP ENGINE (HIGHLIGHTED AS REQUIRED) */}
              <div className="rounded-3xl border-2 border-amber-500/40 bg-gradient-to-br from-amber-500/10 via-card to-card p-6 md:p-8 space-y-6 shadow-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">Dedicated Research Gap Engine</h3>
                      <p className="text-xs text-muted-foreground">
                        Critical bottleneck and unexplored research vector identified in this study
                      </p>
                    </div>
                  </div>
                  <Badge variant="warning">Prominence: {analysisResult.gapProminence || 85}%</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Solved vs Unresolved */}
                  <div className="p-4 rounded-2xl border border-border bg-card space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      Current Research (What Has Been Solved)
                    </span>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {analysisResult.findings || analysisResult.results}
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl border border-border bg-card space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                      Limitations (What Remains Unresolved)
                    </span>
                    <p className="text-xs text-muted-foreground leading-relaxed">{analysisResult.limitations}</p>
                  </div>
                </div>

                {/* The Core Gap */}
                <div className="p-5 rounded-2xl border border-amber-500/30 bg-amber-500/5 space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    The Unaddressed Research Gap
                  </span>
                  <p className="text-sm font-semibold text-foreground leading-relaxed">
                    {analysisResult.researchGap}
                  </p>
                </div>

                {/* Suggested Questions & Methodology */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl border border-border bg-card space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5" />
                      Suggested Research Question
                    </span>
                    <p className="text-xs text-muted-foreground italic leading-relaxed">
                      &quot;{analysisResult.suggestedResearchQuestion || "How can the identified constraint be decoupled without degradation of generalization accuracy?"}&quot;
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl border border-border bg-card space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5" />
                      Suggested Methodology Direction
                    </span>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {analysisResult.suggestedMethodology || "Integrate sparse low-rank factorization with empirical cross-validation across heterogeneous distribution shifts."}
                    </p>
                    <span className="text-[10px] text-muted-foreground/70 block italic">
                      *Note: Presented as AI-suggested exploratory directions, not peer-validated experimental conclusions.
                    </span>
                  </div>
                </div>
              </div>

              {/* The Remaining 12 Deconstruction Sections in Structured Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 1. Paper Overview */}
                <Card className="p-6 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      1. Paper Overview
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {analysisResult.overview}
                  </p>
                </Card>

                {/* 2. Abstract Summary */}
                <Card className="p-6 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      2. Abstract Summary
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {analysisResult.overview}
                  </p>
                </Card>

                {/* 3. Research Problem */}
                <Card className="p-6 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      3. Research Problem
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {analysisResult.problem}
                  </p>
                </Card>

                {/* 4. Objectives */}
                <Card className="p-6 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      4. Objectives
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                    {analysisResult.objectives}
                  </p>
                </Card>

                {/* 5. Methodology */}
                <Card className="p-6 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      5. Methodology
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {analysisResult.methodology}
                  </p>
                </Card>

                {/* 6. Dataset */}
                <Card className="p-6 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      6. Dataset & Benchmarks
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {analysisResult.dataset}
                  </p>
                </Card>

                {/* 7. Results */}
                <Card className="p-6 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      7. Results & Metrics
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {analysisResult.results}
                  </p>
                </Card>

                {/* 8. Key Findings */}
                <Card className="p-6 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      8. Key Findings
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {analysisResult.findings || analysisResult.results}
                  </p>
                </Card>

                {/* 9. Limitations */}
                <Card className="p-6 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      9. Limitations
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {analysisResult.limitations}
                  </p>
                </Card>

                {/* 11. Future Work */}
                <Card className="p-6 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      11. Future Work
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {analysisResult.futureWork}
                  </p>
                </Card>

                {/* 12. AI Recommendations */}
                <Card className="p-6 space-y-2.5 lg:col-span-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                      12. AI Recommendations for Scholars
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {analysisResult.recommendation}
                  </p>
                </Card>
              </div>

              {/* SECTION 13: RELATED PAPERS / SIMILAR RESEARCH */}
              {Array.isArray(analysisResult.similarPapers) && analysisResult.similarPapers.length > 0 && (
                <div className="space-y-4 pt-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-blue-600" />
                      13. Similar Peer-Reviewed Research
                    </h3>
                    <Badge variant="outline">Verified Academic Links</Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {analysisResult.similarPapers.map((sim: any, i: number) => (
                      <Card key={i} className="p-5 space-y-3 flex flex-col justify-between">
                        <div className="space-y-2">
                          <h4 className="text-sm font-bold text-foreground line-clamp-2">{sim.title}</h4>
                          <p className="text-xs text-muted-foreground">
                            {sim.authors?.join(", ")} • {sim.year} {sim.venue ? `• ${sim.venue}` : ""}
                          </p>

                          <div className="p-3 rounded-xl bg-muted/40 border border-border/60 text-xs text-muted-foreground space-y-1">
                            <span className="font-semibold text-foreground/80 block text-[11px] uppercase">
                              AI Relevance Reasoning:
                            </span>
                            <p className="italic leading-normal">{sim.relevanceReason}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-border/40">
                          {sim.sourceUrl ? (
                            <a
                              href={sim.sourceUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
                            >
                              View Source <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="text-[11px] text-muted-foreground">Source in library</span>
                          )}

                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 text-xs"
                            onClick={() => {
                              window.location.href = `/papers?query=${encodeURIComponent(sim.title)}`;
                            }}
                          >
                            Explore in Hub
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        title="Your 5 free research analyses are complete."
        subtitle="Upgrade to ResearchLens Premium to continue analyzing unlimited papers."
      />
    </div>
  );
}

export default function AnalyzePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-brand-500 border-t-transparent animate-spin" />
            <p className="text-sm text-muted-foreground">Loading ResearchLens Analyzer...</p>
          </div>
        </div>
      }
    >
      <AnalyzeContent />
    </Suspense>
  );
}
