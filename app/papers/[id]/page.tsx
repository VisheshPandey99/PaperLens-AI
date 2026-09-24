"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  BookOpen,
  Sparkles,
  Bookmark,
  ExternalLink,
  GitCompare,
  ArrowLeft,
  Calendar,
  Building2,
  Award,
  FileText,
  Tag,
  ShieldCheck,
  CheckCircle2,
  Share2,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function PaperDetailPage() {
  const params = useParams();
  const router = useRouter();
  const paperId = (params?.id as string) || "";

  const [paper, setPaper] = useState<any>(null);
  const [similarPapers, setSimilarPapers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [similarLoading, setSimilarLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!paperId) return;

    setLoading(true);
    setErrorMessage("");

    fetch(`/api/papers/${encodeURIComponent(paperId)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Paper could not be retrieved");
        return res.json();
      })
      .then((data) => {
        if (data.paper) {
          setPaper(data.paper);
          // Fetch similar research
          fetchSimilarPapers(data.paper);
        } else {
          setErrorMessage("Paper not found in academic catalog.");
        }
      })
      .catch((err) => {
        console.error("Fetch paper error:", err);
        setErrorMessage("Unable to load research paper details. Please try again.");
      })
      .finally(() => setLoading(false));
  }, [paperId]);

  const fetchSimilarPapers = async (paperData: any) => {
    setSimilarLoading(true);
    try {
      const topicQuery =
        paperData.topics?.[0] ||
        paperData.title?.slice(0, 80) ||
        "artificial intelligence";

      const res = await fetch(
        `/api/research/search?query=${encodeURIComponent(topicQuery)}&limit=4&sort=citations`
      );
      if (res.ok) {
        const data = await res.json();
        if (data.papers) {
          // Filter out current paper
          const filtered = data.papers.filter(
            (p: any) => p.id !== paperData.id && p.openAlexId !== paperData.openAlexId
          );
          setSimilarPapers(filtered.slice(0, 3));
        }
      }
    } catch (err) {
      console.warn("Failed to fetch similar papers:", err);
    } finally {
      setSimilarLoading(false);
    }
  };

  const handleSavePaper = async (targetId: string = paperId) => {
    try {
      const res = await fetch(`/api/papers/${encodeURIComponent(targetId)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: "Saved from Paper Details" }),
      });
      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  const copyShareLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <AppSidebar />

        <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto">
          {/* Back Navigation */}
          <div className="flex items-center justify-between border-b border-border/60 pb-4">
            <Link
              href="/papers"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Research Hub
            </Link>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs gap-1.5"
                onClick={copyShareLink}
              >
                <Share2 className="w-3.5 h-3.5" />
                {copiedLink ? "Link Copied!" : "Share"}
              </Button>
            </div>
          </div>

          {loading ? (
            <Card className="p-8 space-y-6 animate-pulse">
              <div className="h-6 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-1/3" />
              <div className="h-32 bg-muted/60 rounded" />
            </Card>
          ) : errorMessage || !paper ? (
            <Card className="p-12 text-center space-y-4">
              <BookOpen className="w-10 h-10 text-muted-foreground/40 mx-auto" />
              <h2 className="text-lg font-bold text-foreground">Paper Unavailable</h2>
              <p className="text-sm text-muted-foreground">{errorMessage}</p>
              <Link href="/papers">
                <Button variant="academic" size="sm" className="mt-2">
                  Return to Hub
                </Button>
              </Link>
            </Card>
          ) : (
            <>
              {/* Paper Primary Details Card */}
              <Card className="p-6 md:p-8 space-y-6 border border-border shadow-xs">
                {/* Badges strip */}
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="text-xs font-semibold uppercase">
                    Research indexed by OpenAlex
                  </Badge>

                  {paper.openAlexId && (
                    <Badge variant="secondary" className="text-xs font-mono">
                      ID: {paper.openAlexId}
                    </Badge>
                  )}

                  {paper.isOpenAccess ? (
                    <Badge variant="success" className="text-xs font-medium">
                      Open Access Available
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs text-muted-foreground">
                      Publisher Archive
                    </Badge>
                  )}

                  {paper.type && (
                    <Badge variant="outline" className="text-xs capitalize">
                      {paper.type}
                    </Badge>
                  )}
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight leading-snug">
                  {paper.title}
                </h1>

                {/* Metadata row */}
                <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-muted-foreground border-y border-border/50 py-3.5">
                  <div className="flex items-center gap-1.5 font-medium text-foreground">
                    <Calendar className="w-4 h-4 text-brand-500 shrink-0" />
                    <span>{paper.publicationDate || paper.year || "N/A"}</span>
                  </div>

                  {paper.institution && (
                    <div className="flex items-center gap-1.5 font-medium text-foreground">
                      <Building2 className="w-4 h-4 text-blue-500 shrink-0" />
                      <span className="truncate max-w-[260px]">{paper.institution}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-1.5 font-medium text-foreground">
                    <Award className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>{(paper.citationCount ?? 0).toLocaleString()} Citations</span>
                  </div>

                  {paper.venue && (
                    <div className="flex items-center gap-1.5 font-medium text-foreground">
                      <FileText className="w-4 h-4 text-purple-500 shrink-0" />
                      <span className="truncate max-w-[240px]">{paper.venue}</span>
                    </div>
                  )}

                  {paper.doi && (
                    <div className="font-mono text-muted-foreground truncate max-w-[220px]">
                      DOI: {paper.doi}
                    </div>
                  )}
                </div>

                {/* Authors Section */}
                <div className="space-y-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Authors & Researchers
                  </span>
                  <p className="text-sm font-semibold text-foreground leading-relaxed">
                    {Array.isArray(paper.authors)
                      ? paper.authors.join(" • ")
                      : paper.authors || "Unknown Authors"}
                  </p>
                </div>

                {/* Abstract Section */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Paper Abstract
                  </span>
                  <div className="p-4 rounded-xl bg-muted/40 border border-border/50 text-sm text-foreground/90 leading-relaxed font-serif">
                    {paper.abstract || "Abstract unavailable."}
                  </div>
                </div>

                {/* Research Topics */}
                {paper.topics && paper.topics.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5" />
                      Research Topics & Concepts
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {paper.topics.map((t: string, idx: number) => (
                        <Badge key={idx} variant="outline" className="text-xs py-1 px-2.5">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions Ribbon */}
                <div className="pt-4 border-t border-border flex flex-wrap items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2.5">
                    {/* Analyze with AI Button */}
                    <Link
                      href={`/analyze?openAlexId=${encodeURIComponent(paper.openAlexId || paper.id)}&title=${encodeURIComponent(paper.title)}`}
                    >
                      <Button variant="academic" className="gap-2 font-semibold shadow-sm">
                        <Sparkles className="w-4 h-4" />
                        Analyze with AI
                      </Button>
                    </Link>

                    {/* Save Paper Button */}
                    <Button
                      variant="outline"
                      className="gap-2 text-xs font-medium"
                      onClick={() => handleSavePaper(paper.id)}
                    >
                      <Bookmark className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                      {savedSuccess ? "Saved to Library!" : "Save Paper"}
                    </Button>

                    {/* Compare Button */}
                    <Link
                      href={`/compare?title=${encodeURIComponent(paper.title)}`}
                    >
                      <Button variant="outline" className="gap-2 text-xs font-medium">
                        <GitCompare className="w-4 h-4" />
                        Compare
                      </Button>
                    </Link>
                  </div>

                  {/* Open Original Source */}
                  {paper.sourceUrl && (
                    <a
                      href={paper.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
                    >
                      Open Original Source
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </Card>

              {/* Similar Research Section */}
              <div className="space-y-4 pt-4">
                <div className="border-b border-border/60 pb-3">
                  <h2 className="text-lg font-bold text-foreground tracking-tight flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-brand-500" />
                    Similar Research
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Explore related academic works discovered by OpenAlex citation and topic graphs.
                  </p>
                </div>

                {similarLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                      <Card key={i} className="p-4 space-y-3 animate-pulse">
                        <div className="h-4 bg-muted rounded w-3/4" />
                        <div className="h-3 bg-muted rounded w-1/2" />
                        <div className="h-12 bg-muted/60 rounded" />
                      </Card>
                    ))}
                  </div>
                ) : similarPapers.length === 0 ? (
                  <Card className="p-6 text-center text-xs text-muted-foreground">
                    No related papers discovered for this specific research topic.
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {similarPapers.map((sim) => (
                      <Card
                        key={sim.id}
                        className="p-5 flex flex-col justify-between space-y-3 hover:border-brand-500/40 transition-colors shadow-xs"
                      >
                        <div className="space-y-2">
                          <h3 className="text-sm font-bold text-foreground line-clamp-2 leading-snug">
                            {sim.title}
                          </h3>

                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {sim.authors?.slice(0, 2).join(", ")} • {sim.year}
                          </p>

                          {sim.primaryInstitution && (
                            <p className="text-[11px] text-muted-foreground truncate">
                              🏛️ {sim.primaryInstitution}
                            </p>
                          )}

                          <div className="flex items-center gap-2 text-[11px] text-muted-foreground pt-1">
                            <span className="font-semibold text-foreground flex items-center gap-1">
                              <Award className="w-3 h-3 text-amber-500" />
                              {sim.citationCount?.toLocaleString() || 0} citations
                            </span>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-border/40 flex items-center justify-between gap-2">
                          <Link href={`/papers/${sim.id}`}>
                            <Button variant="academic" size="sm" className="h-7 text-xs px-2.5">
                              View Details
                            </Button>
                          </Link>

                          {sim.sourceUrl && (
                            <a
                              href={sim.sourceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
                            >
                              Source <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
