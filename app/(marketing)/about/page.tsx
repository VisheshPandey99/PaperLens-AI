import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ShieldCheck, BookOpen, Sparkles, Database, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="brand">Our Academic Mission</Badge>
          <h1 className="text-4xl sm:text-5xl font-black text-foreground tracking-tight">
            Elevating Scientific Discovery Through Responsible AI
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            PaperLens AI was founded with a singular conviction: scholarly researchers should not waste weeks manually decoding papers, searching for disconnected gaps, or battling hallucinated AI citations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-foreground text-lg">Zero Hallucinations</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Every citation generated or suggested by our platform is linked directly to real academic records with verified DOIs and URLs.
            </p>
          </Card>

          <Card className="p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-foreground text-lg">Open Science Integration</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Directly connected to Semantic Scholar, OpenAlex, and Crossref, indexing over 250 million peer-reviewed works.
            </p>
          </Card>

          <Card className="p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-foreground text-lg">Academic Integrity First</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We provide structured drafts and hypothesis proposals, never presenting AI synthetic outputs as actual empirical findings.
            </p>
          </Card>
        </div>

        <div className="rounded-3xl border border-border bg-card p-8 md:p-12 space-y-6">
          <h2 className="text-2xl font-bold text-foreground">Our Philosophy: Read Smarter. Research Deeper. Create Better.</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The volume of published literature doubles every few years. Even leading scholars struggle to maintain comprehensive domain awareness. PaperLens AI serves as a cognitive multiplier: parsing dense methodological sections, summarizing statistical datasets, highlighting unaddressed constraints, and helping researchers formulate sharp, publishable questions.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
