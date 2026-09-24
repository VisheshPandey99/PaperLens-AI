"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  PenTool,
  Sparkles,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Layers,
  FileText,
  Search,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const GENERATION_STEPS = [
  "Step 1: Understanding research topic and problem statement...",
  "Step 2: Structuring formal academic outline & hypotheses...",
  "Step 3: Formulating research questions (RQ1-RQ4)...",
  "Step 4: Formulating methodology proposal & system architecture...",
  "Step 5: Querying verified literature across Semantic Scholar & OpenAlex...",
  "Step 6: Synthesizing 12-section research paper draft...",
];

export default function GeneratePaperPage() {
  const router = useRouter();

  const [topic, setTopic] = useState("AI-based early detection of plant diseases via lightweight vision transformers");
  const [problem, setProblem] = useState("Crop loss from delayed foliar disease diagnosis in low-resource agricultural edge settings");
  const [objective, setObjective] = useState("Develop an energy-efficient Edge-ViT model capable of high-accuracy foliar disease classification under 5W power");
  const [field, setField] = useState("Agricultural Artificial Intelligence & Computer Vision");
  const [methodology, setMethodology] = useState("Hybrid Vision Transformer with MobileNetV4 depthwise residual blocks and localized window self-attention");
  const [targetLengthWords, setTargetLengthWords] = useState(3000);
  const [citationStyle, setCitationStyle] = useState<"APA" | "IEEE" | "Harvard" | "MLA" | "Chicago">("APA");
  const [additionalInstructions, setAdditionalInstructions] = useState("Emphasize post-training INT8 quantization constraints and mobile robotics deployment.");

  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [error, setError] = useState("");

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setCurrentStepIndex(0);
    setError("");

    const interval = setInterval(() => {
      setCurrentStepIndex((prev) => (prev < GENERATION_STEPS.length - 1 ? prev + 1 : prev));
    }, 1200);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          problem,
          objective,
          field,
          methodology,
          targetLengthWords,
          citationStyle,
          additionalInstructions,
        }),
      });

      const data = await res.json();
      clearInterval(interval);
      setIsGenerating(false);

      if (!res.ok) {
        setError(data.message || "Failed to generate research paper draft.");
        return;
      }

      // Redirect to the interactive paper editor
      if (data.draftId) {
        router.push(`/generate/${data.draftId}`);
      }
    } catch (err) {
      clearInterval(interval);
      setIsGenerating(false);
      setError("An unexpected network error occurred.");
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
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="brand" className="gap-1.5 py-0.5">
                <Sparkles className="w-3 h-3" />
                Scholarly Draft Synthesis
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              AI Research Paper Generator
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Turn your research idea into a structured 12-section academic research paper draft, grounded in verified literature citations.
            </p>
          </div>

          {/* Generator Wizard Form */}
          {!isGenerating ? (
            <div className="max-w-3xl mx-auto space-y-6">
              <Card className="p-6 md:p-8 space-y-6 shadow-sm">
                {error && (
                  <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-xs text-destructive flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleGenerate} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">Research Topic *</label>
                    <Input
                      placeholder="e.g. AI-based early detection of plant diseases"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground">Core Research Problem *</label>
                      <Input
                        placeholder="e.g. High latency and memory consumption on edge hardware"
                        value={problem}
                        onChange={(e) => setProblem(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground">Research Objective *</label>
                      <Input
                        placeholder="e.g. Formulate an energy-efficient Edge-ViT neural network"
                        value={objective}
                        onChange={(e) => setObjective(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground">Academic Field / Discipline</label>
                      <Input
                        placeholder="e.g. Computer Science / Computer Vision"
                        value={field}
                        onChange={(e) => setField(e.target.value)}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground">Methodology Preference</label>
                      <Input
                        placeholder="e.g. Convolutional Vision Transformer Hybrid"
                        value={methodology}
                        onChange={(e) => setMethodology(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground">Target Draft Length (Words)</label>
                      <select
                        value={targetLengthWords}
                        onChange={(e) => setTargetLengthWords(Number(e.target.value))}
                        className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value={2000}>Short Paper (~2,000 words)</option>
                        <option value={3000}>Standard Conference Paper (~3,000 words)</option>
                        <option value={5000}>Comprehensive Journal Draft (~5,000 words)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-foreground">Citation Style</label>
                      <select
                        value={citationStyle}
                        onChange={(e) => setCitationStyle(e.target.value as any)}
                        className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="APA">APA 7th Edition</option>
                        <option value="IEEE">IEEE Reference Standard</option>
                        <option value="Harvard">Harvard Reference Style</option>
                        <option value="MLA">MLA 9th Edition</option>
                        <option value="Chicago">Chicago Manual of Style</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">Additional Instructions / Focus Areas</label>
                    <Textarea
                      placeholder="Specify any particular benchmarks, hardware targets, or theoretical constraints..."
                      value={additionalInstructions}
                      onChange={(e) => setAdditionalInstructions(e.target.value)}
                      rows={2}
                    />
                  </div>

                  {/* Academic Draft Notice */}
                  <div className="p-3 rounded-xl bg-muted/40 border border-border/80 text-[11px] text-muted-foreground leading-relaxed">
                    <strong>Notice:</strong> Generates a structured academic research draft. All theoretical formulations and hypotheses are proposals; empirical results are labeled as &quot;Expected Results&quot; for ethical scientific integrity.
                  </div>

                  <Button type="submit" variant="academic" size="lg" className="w-full font-semibold gap-2 shadow-md">
                    <PenTool className="w-4 h-4" />
                    Generate Research Paper Draft
                  </Button>
                </form>
              </Card>
            </div>
          ) : (
            <Card className="max-w-2xl mx-auto p-8 md:p-12 space-y-8 text-center shadow-xl">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 flex items-center justify-center mx-auto animate-pulse">
                <PenTool className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-foreground">Generating Academic Research Draft...</h3>
                <p className="text-xs text-muted-foreground">
                  Our pipeline is constructing hypotheses, mathematical frameworks, and literature references.
                </p>
              </div>

              {/* Progress Steps */}
              <div className="space-y-3 max-w-md mx-auto text-left">
                {GENERATION_STEPS.map((step, idx) => {
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
                          : "text-muted-foreground/40"
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
                  value={((currentStepIndex + 1) / GENERATION_STEPS.length) * 100}
                  indicatorClassName="bg-blue-600"
                />
              </div>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}
