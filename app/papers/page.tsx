"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  BookOpen,
  Sparkles,
  ExternalLink,
  Bookmark,
  Filter,
  CheckCircle2,
  Calendar,
  Layers,
  Award,
  Building2,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  X,
  Compass,
  ArrowRight,
  Info,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const POPULAR_IITS = [
  "IIT Delhi",
  "IIT Bombay",
  "IIT Madras",
  "IIT Kanpur",
  "IIT Kharagpur",
  "IIT Roorkee",
  "IIT Hyderabad",
  "IIT Guwahati",
  "IIT Indore",
  "IIT BHU (Varanasi)",
];

const POPULAR_NITS = [
  "NIT Trichy",
  "NIT Warangal",
  "NIT Rourkela",
  "NIT Surathkal",
  "NIT Calicut",
  "MNNIT Allahabad",
  "MNIT Jaipur",
  "NIT Kurukshetra",
  "NIT Durgapur",
  "NIT Silchar",
];

const INSTITUTION_TYPES = [
  { value: "all", label: "All Types" },
  { value: "education", label: "Universities & Colleges" },
  { value: "facility", label: "Research Facilities" },
  { value: "government", label: "Government Labs" },
  { value: "company", label: "Corporate R&D" },
  { value: "healthcare", label: "Medical Institutes" },
];

const YEARS = [
  { value: "", label: "All Years" },
  { value: "2026", label: "2026" },
  { value: "2025", label: "2025" },
  { value: "2024", label: "2024" },
  { value: "2023", label: "2023" },
  { value: "2022", label: "2022" },
  { value: "2020", label: "2020 - 2026" },
  { value: "2015", label: "2015 - 2026" },
];

export default function PapersHubPage() {
  const [query, setQuery] = useState("artificial intelligence healthcare");
  const [activeQuery, setActiveQuery] = useState("artificial intelligence healthcare");
  const [institution, setInstitution] = useState<string>("all");
  const [institutionType, setInstitutionType] = useState<string>("all");
  const [yearFilter, setYearFilter] = useState<string>("");
  const [openAccessOnly, setOpenAccessOnly] = useState<boolean>(false);
  const [sort, setSort] = useState<string>("relevance");
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalResults, setTotalResults] = useState<number>(0);

  const [papers, setPapers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>("Searching academic literature...");
  const [sourceEngine, setSourceEngine] = useState<string>("OpenAlex Scholarly Engine");
  const [resolvedInstitution, setResolvedInstitution] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState<string | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);
  const [customInstitutionSearch, setCustomInstitutionSearch] = useState<string>("");

  const executeSearch = useCallback(
    async (targetPage = 1) => {
      setLoading(true);
      if (institution !== "all") {
        setLoadingMessage(`Finding research from ${institution}...`);
      } else {
        setLoadingMessage("Searching academic literature...");
      }

      try {
        const params = new URLSearchParams({
          query: query.trim(),
          page: targetPage.toString(),
          limit: "12",
          sort,
        });

        if (institution && institution !== "all") {
          params.set("institution", institution);
        }

        if (institutionType && institutionType !== "all") {
          params.set("institutionType", institutionType);
        }

        if (yearFilter) {
          if (yearFilter === "2020" || yearFilter === "2015") {
            params.set("yearMin", yearFilter);
          } else {
            params.set("year", yearFilter);
          }
        }

        if (openAccessOnly) {
          params.set("openAccessOnly", "true");
        }

        const res = await fetch(`/api/research/search?${params.toString()}`);
        const data = await res.json();

        if (res.ok && data.papers) {
          setPapers(data.papers);
          setTotalResults(data.total || data.papers.length);
          setPage(data.page || targetPage);
          setTotalPages(data.totalPages || Math.ceil((data.total || data.papers.length) / 12) || 1);
          setSourceEngine(data.source || "OpenAlex");
          setResolvedInstitution(data.institution || null);
          setActiveQuery(query);
        } else {
          setPapers([]);
          setTotalResults(0);
          setTotalPages(1);
        }
      } catch (err) {
        console.error("Search error:", err);
        setPapers([]);
      } finally {
        setLoading(false);
      }
    },
    [query, institution, institutionType, yearFilter, openAccessOnly, sort]
  );

  useEffect(() => {
    executeSearch(1);
  }, []);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === page) return;
    setPage(newPage);
    executeSearch(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleApplyIndianCategory = (category: "IIT" | "NIT" | "UNIVERSITIES") => {
    if (category === "IIT") {
      setInstitution("IIT Delhi");
    } else if (category === "NIT") {
      setInstitution("NIT Trichy");
    } else {
      setInstitution("Indian Institute of Science");
    }
    setPage(1);
    // Trigger immediate search
    setTimeout(() => {
      executeSearch(1);
    }, 50);
  };

  const savePaper = async (paperId: string) => {
    try {
      const res = await fetch(`/api/papers/${encodeURIComponent(paperId)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: "Saved from Research Hub" }),
      });
      if (res.ok) {
        setSavedSuccess(paperId);
        setTimeout(() => setSavedSuccess(null), 3000);
      }
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <AppSidebar />

        <main className="flex-1 p-4 sm:p-6 md:p-8 space-y-6 overflow-y-auto">
          {/* Header */}
          <div className="border-b border-border/60 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                  Academic Research Hub
                </h1>
                <Badge variant="outline" className="text-[11px] font-semibold text-brand-600 dark:text-brand-400">
                  Research indexed by OpenAlex
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-3xl">
                Discover peer-reviewed literature indexed by OpenAlex. Filter by IITs, NITs, publication years, and open-access status with instant AI analyses.
              </p>
            </div>

            {/* Indian Research Quick Exploration */}
            <div className="hidden lg:flex items-center gap-2 shrink-0">
              <span className="text-xs text-muted-foreground font-semibold flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-brand-500" />
                Quick Explore:
              </span>
              <Button
                variant={institution.includes("IIT") ? "academic" : "outline"}
                size="sm"
                className="h-8 text-xs px-2.5"
                onClick={() => handleApplyIndianCategory("IIT")}
              >
                IIT Research
              </Button>
              <Button
                variant={institution.includes("NIT") ? "academic" : "outline"}
                size="sm"
                className="h-8 text-xs px-2.5"
                onClick={() => handleApplyIndianCategory("NIT")}
              >
                NIT Research
              </Button>
            </div>
          </div>

          {/* Explore Indian Research Banner Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div
              onClick={() => handleApplyIndianCategory("IIT")}
              className={`cursor-pointer rounded-xl border p-4 transition-all ${
                institution.includes("IIT")
                  ? "border-brand-500/80 bg-brand-500/5 shadow-xs"
                  : "border-border/80 bg-card hover:border-brand-500/40"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
                  Indian Research
                </span>
                <span className="text-[10px] font-mono text-muted-foreground">OpenAlex</span>
              </div>
              <h3 className="text-sm font-bold text-foreground mt-1 flex items-center justify-between">
                IIT Research Works
                <ArrowRight className="w-3.5 h-3.5 text-brand-500" />
              </h3>
              <p className="text-[11px] text-muted-foreground mt-1">
                Explore engineering & AI works from IIT Delhi, Bombay, Madras, Kanpur & more.
              </p>
            </div>

            <div
              onClick={() => handleApplyIndianCategory("NIT")}
              className={`cursor-pointer rounded-xl border p-4 transition-all ${
                institution.includes("NIT")
                  ? "border-brand-500/80 bg-brand-500/5 shadow-xs"
                  : "border-border/80 bg-card hover:border-brand-500/40"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  National Institutes
                </span>
                <span className="text-[10px] font-mono text-muted-foreground">OpenAlex</span>
              </div>
              <h3 className="text-sm font-bold text-foreground mt-1 flex items-center justify-between">
                NIT Research Works
                <ArrowRight className="w-3.5 h-3.5 text-blue-500" />
              </h3>
              <p className="text-[11px] text-muted-foreground mt-1">
                Explore works from NIT Trichy, Warangal, Rourkela, Surathkal & Calicut.
              </p>
            </div>

            <div
              onClick={() => handleApplyIndianCategory("UNIVERSITIES")}
              className={`cursor-pointer rounded-xl border p-4 transition-all ${
                institution.includes("Science") || institution.includes("University")
                  ? "border-brand-500/80 bg-brand-500/5 shadow-xs"
                  : "border-border/80 bg-card hover:border-brand-500/40"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                  Premier Institutes
                </span>
                <span className="text-[10px] font-mono text-muted-foreground">OpenAlex</span>
              </div>
              <h3 className="text-sm font-bold text-foreground mt-1 flex items-center justify-between">
                Indian Universities & IISc
                <ArrowRight className="w-3.5 h-3.5 text-amber-500" />
              </h3>
              <p className="text-[11px] text-muted-foreground mt-1">
                Research from IISc Bangalore, AIIMS, TIFR, and central universities.
              </p>
            </div>
          </div>

          {/* Search Bar & Comprehensive Filters Card */}
          <Card className="p-4 sm:p-5 space-y-4">
            {/* Primary Search Input */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Input
                  placeholder="Search research topic, paper title, author, keywords, or DOI (e.g. 10.1109/...)..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && executeSearch(1)}
                  className="pl-9 h-11 text-sm bg-background"
                />
                <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-3.5" />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="sm:hidden h-11 px-3 text-xs gap-1.5 shrink-0"
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  Filters
                </Button>

                <Button
                  variant="academic"
                  className="flex-1 sm:flex-initial h-11 px-6 font-semibold gap-2 shadow-sm shrink-0"
                  onClick={() => executeSearch(1)}
                  disabled={loading}
                >
                  <Search className="w-4 h-4" />
                  {loading ? "Searching..." : "Search Papers"}
                </Button>
              </div>
            </div>

            {/* Filter Controls (Responsive: always visible on md+, collapsible on mobile) */}
            <div
              className={`space-y-3 pt-3 border-t border-border/50 text-xs ${
                showMobileFilters ? "block" : "hidden sm:block"
              }`}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* 1. Institution Selector */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-brand-500" />
                    Institution
                  </label>
                  <select
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    className="w-full h-9 px-2.5 rounded-lg border border-input bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-brand-500"
                  >
                    <option value="all">All Institutions</option>
                    <optgroup label="Indian Institutes of Technology (IITs)">
                      {POPULAR_IITS.map((iit) => (
                        <option key={iit} value={iit}>
                          {iit}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="National Institutes of Technology (NITs)">
                      {POPULAR_NITS.map((nit) => (
                        <option key={nit} value={nit}>
                          {nit}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Premier Research Institutes">
                      <option value="Indian Institute of Science">IISc Bangalore</option>
                      <option value="All India Institute of Medical Sciences">AIIMS New Delhi</option>
                      <option value="Tata Institute of Fundamental Research">TIFR Mumbai</option>
                      <option value="Jawaharlal Nehru University">JNU</option>
                      <option value="University of Delhi">Delhi University</option>
                    </optgroup>
                  </select>
                </div>

                {/* 2. Institution Type */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    Institution Type
                  </label>
                  <select
                    value={institutionType}
                    onChange={(e) => setInstitutionType(e.target.value)}
                    className="w-full h-9 px-2.5 rounded-lg border border-input bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-brand-500"
                  >
                    {INSTITUTION_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 3. Publication Year */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-brand-500" />
                    Publication Year
                  </label>
                  <select
                    value={yearFilter}
                    onChange={(e) => setYearFilter(e.target.value)}
                    className="w-full h-9 px-2.5 rounded-lg border border-input bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-brand-500"
                  >
                    {YEARS.map((y) => (
                      <option key={y.value} value={y.value}>
                        {y.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 4. Sort Order */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                    Sort Order
                  </label>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="w-full h-9 px-2.5 rounded-lg border border-input bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-brand-500"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="citations">Most Cited (Citations)</option>
                    <option value="newest">Newest First</option>
                  </select>
                </div>
              </div>

              {/* Bottom bar with Open Access checkbox and status */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={openAccessOnly}
                      onChange={(e) => setOpenAccessOnly(e.target.checked)}
                      className="rounded border-input text-brand-600 focus:ring-brand-500 h-4 w-4"
                    />
                    <span className="text-xs text-foreground font-semibold">Open Access Only</span>
                  </label>

                  {institution !== "all" && (
                    <button
                      onClick={() => {
                        setInstitution("all");
                        executeSearch(1);
                      }}
                      className="text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1 underline"
                    >
                      Clear Institution <X className="w-3 h-3" />
                    </button>
                  )}
                </div>

                <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                  <Info className="w-3 h-3 text-muted-foreground" />
                  <span>Research indexed by OpenAlex</span>
                  {resolvedInstitution && (
                    <span className="font-semibold text-brand-600 dark:text-brand-400">
                      • {resolvedInstitution}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Results Summary & Header */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                Found {totalResults.toLocaleString()} Academic Works
                {institution !== "all" && (
                  <Badge variant="outline" className="text-xs">
                    {institution}
                  </Badge>
                )}
              </h2>
              <p className="text-xs text-muted-foreground">
                Showing page {page} of {Math.max(1, totalPages)}
              </p>
            </div>

            {/* Pagination Controls Top */}
            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-2.5 text-xs gap-1"
                  disabled={page <= 1 || loading}
                  onClick={() => handlePageChange(page - 1)}
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  Previous
                </Button>
                <span className="text-xs px-2 font-mono text-muted-foreground">
                  {page} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-2.5 text-xs gap-1"
                  disabled={page >= totalPages || loading}
                  onClick={() => handlePageChange(page + 1)}
                >
                  Next
                  <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            )}
          </div>

          {/* Results Grid */}
          {loading ? (
            <div className="space-y-4">
              <div className="text-center py-4 text-xs font-semibold text-muted-foreground animate-pulse">
                {loadingMessage}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="p-6 space-y-4 animate-pulse">
                    <div className="flex justify-between items-center">
                      <div className="h-4 bg-muted rounded w-1/4" />
                      <div className="h-4 bg-muted rounded w-16" />
                    </div>
                    <div className="h-5 bg-muted rounded w-4/5" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                    <div className="h-16 bg-muted/60 rounded" />
                  </Card>
                ))}
              </div>
            </div>
          ) : papers.length === 0 ? (
            <Card className="p-12 text-center space-y-3">
              <BookOpen className="w-10 h-10 text-muted-foreground/40 mx-auto" />
              <p className="text-sm font-bold text-foreground">
                No research papers were found for this search.
              </p>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                Try broadening your keywords, clearing the institution filter, or selecting a wider publication year range.
              </p>
              <div className="pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setQuery("machine learning");
                    setInstitution("all");
                    setYearFilter("");
                    setOpenAccessOnly(false);
                  }}
                >
                  Reset Search Filters
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {papers.map((paper) => (
                <Card
                  key={paper.id}
                  className="p-5 sm:p-6 space-y-4 flex flex-col justify-between hover:border-brand-500/40 transition-colors shadow-xs border border-border"
                >
                  <div className="space-y-2.5">
                    {/* Source & Open Access Badge */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <Badge variant="outline" className="text-[10px] font-mono">
                          OpenAlex
                        </Badge>
                        {paper.openAlexId && (
                          <span className="text-[10px] font-mono text-muted-foreground">
                            {paper.openAlexId}
                          </span>
                        )}
                      </div>

                      {paper.isOpenAccess && (
                        <Badge variant="success" className="text-[10px]">
                          Open Access
                        </Badge>
                      )}
                    </div>

                    {/* Paper Title */}
                    <Link href={`/papers/${paper.id}`}>
                      <h3 className="text-base font-bold text-foreground leading-snug line-clamp-2 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                        {paper.title}
                      </h3>
                    </Link>

                    {/* Authors & Year & Venue */}
                    <p className="text-xs text-muted-foreground">
                      {paper.authors?.slice(0, 3).join(", ")}
                      {paper.authors?.length > 3 ? " et al." : ""} • {paper.year}
                      {paper.venue ? ` • ${paper.venue}` : ""}
                    </p>

                    {/* Institution Affiliation if present */}
                    {paper.primaryInstitution && (
                      <p className="text-[11px] text-muted-foreground flex items-center gap-1 truncate">
                        <Building2 className="w-3 h-3 text-brand-500 shrink-0" />
                        <span className="truncate">{paper.primaryInstitution}</span>
                      </p>
                    )}

                    {/* Abstract (Reconstructed from OpenAlex) */}
                    <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                      {paper.abstract}
                    </p>

                    {/* Citations & DOI */}
                    <div className="flex flex-wrap items-center gap-4 text-[11px] text-muted-foreground pt-1">
                      <span className="font-semibold text-foreground/90 flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-amber-500" />
                        {paper.citationCount?.toLocaleString() || 0} citations
                      </span>

                      {paper.doi && (
                        <span className="truncate max-w-[180px] font-mono">
                          DOI: {paper.doi}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-border/50">
                    <div className="flex items-center gap-2">
                      {/* Analyze with AI */}
                      <Link
                        href={`/analyze?openAlexId=${encodeURIComponent(paper.openAlexId || paper.id)}&title=${encodeURIComponent(paper.title)}`}
                      >
                        <Button variant="academic" size="sm" className="h-8 text-xs gap-1.5 shadow-xs">
                          <Sparkles className="w-3 h-3" />
                          Analyze
                        </Button>
                      </Link>

                      {/* Save Paper */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-xs gap-1"
                        onClick={() => savePaper(paper.id)}
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                        {savedSuccess === paper.id ? "Saved!" : "Save"}
                      </Button>

                      {/* View Details Page */}
                      <Link href={`/papers/${paper.id}`}>
                        <Button variant="outline" size="sm" className="h-8 text-xs">
                          Details
                        </Button>
                      </Link>
                    </div>

                    {/* Open Original Source */}
                    {paper.sourceUrl && (
                      <a
                        href={paper.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
                      >
                        View Source <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Bottom Pagination */}
          {totalPages > 1 && !loading && (
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border/60">
              <span className="text-xs text-muted-foreground">
                Showing page <strong className="text-foreground">{page}</strong> of{" "}
                <strong className="text-foreground">{totalPages}</strong> (
                {totalResults.toLocaleString()} total works)
              </span>

              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-3 text-xs gap-1"
                  disabled={page <= 1}
                  onClick={() => handlePageChange(page - 1)}
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  Previous
                </Button>

                {/* Page numbers */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, idx) => {
                  let pageNum = page - 2 + idx;
                  if (page < 3) pageNum = idx + 1;
                  if (page > totalPages - 2) pageNum = totalPages - 4 + idx;
                  if (pageNum < 1 || pageNum > totalPages) return null;

                  return (
                    <Button
                      key={pageNum}
                      variant={pageNum === page ? "academic" : "outline"}
                      size="sm"
                      className="h-8 w-8 p-0 text-xs font-semibold"
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}

                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-3 text-xs gap-1"
                  disabled={page >= totalPages}
                  onClick={() => handlePageChange(page + 1)}
                >
                  Next
                  <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
