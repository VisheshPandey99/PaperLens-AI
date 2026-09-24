import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, TrendingUp, GitCompare, PenTool, Search, FileCheck, ArrowRight } from "lucide-react";

export default function FeaturesPage() {
  const features = [
    {
      icon: BookOpen,
      title: "13-Section Deep Paper Analysis",
      desc: "Deconstructs any academic PDF into 13 structured dimensions: Overview, Abstract Summary, Research Problem, Objectives, Methodology, Dataset, Results, Key Findings, Limitations, Research Gap, Future Work, AI Recommendations, and Related Papers.",
      badge: "Core Engine",
    },
    {
      icon: TrendingUp,
      title: "Research Gap Discovery Engine",
      desc: "Separates solved knowledge from unresolved bottlenecks. Formulates potential research questions and suggests methodologies for upcoming papers.",
      badge: "Exclusive",
    },
    {
      icon: GitCompare,
      title: "Cross-Paper Comparison Matrix",
      desc: "Compare up to 5 papers side-by-side. Automatically identifies cross-study research gaps where current approaches diverge or exhibit mutual limitations.",
      badge: "Multi-Study",
    },
    {
      icon: PenTool,
      title: "AI Research Paper Generator",
      desc: "Produces 12-section research paper drafts from your topic, problem statement, and methodology preferences. Features an interactive in-browser section editor.",
      badge: "Drafting",
    },
    {
      icon: Search,
      title: "Academic Research Hub",
      desc: "Integrated with Semantic Scholar, OpenAlex, and Crossref. Discover verified papers with citations, DOIs, and direct open-access PDFs.",
      badge: "Discovery",
    },
    {
      icon: FileCheck,
      title: "High-Resolution PDF & DOCX Export",
      desc: "One-click export of generated drafts and gap reports into beautifully styled PDFs or Microsoft Word DOCX files ready for collaborative editing.",
      badge: "Productivity",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="brand">Full Architecture</Badge>
          <h1 className="text-4xl sm:text-5xl font-black text-foreground tracking-tight">
            Engineered for Precision & Scholarly Rigor
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Every feature in PaperLens AI is crafted to accelerate your research without compromising scientific validity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <Card key={i} className="p-8 space-y-4 hover:border-brand-500/50 transition-all flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    <Badge variant="outline">{f.badge}</Badge>
                  </div>
                  <h3 className="text-xl font-bold text-foreground">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="text-center pt-8">
          <Link href="/signup">
            <Button variant="academic" size="lg" className="gap-2">
              Start Free with 5 Analyses
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
