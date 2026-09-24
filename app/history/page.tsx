"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Clock,
  BookOpen,
  PenTool,
  GitCompare,
  Bookmark,
  Trash2,
  ExternalLink,
  Search,
  Filter,
  ArrowRight,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function HistoryPage() {
  const [historyData, setHistoryData] = useState<any>({
    analyses: [],
    generatedPapers: [],
    comparisons: [],
    savedPapers: [],
  });
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const loadHistory = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/history");
      const data = await res.json();
      if (res.ok) {
        setHistoryData(data);
      }
    } catch (err) {
      console.error("Failed to load history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const deleteItem = async (id: string, type: string) => {
    if (!confirm("Are you sure you want to delete this research item?")) return;
    try {
      const res = await fetch(`/api/history?id=${id}&type=${type}`, {
        method: "DELETE",
      });
      if (res.ok) {
        loadHistory();
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const filterItems = (items: any[]) => {
    if (!searchQuery.trim()) return items;
    return items.filter((item) =>
      item.title?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <AppSidebar />

        <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                Research History & Archives
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Access your past paper analyses, generated drafts, multi-study matrices, and saved academic works.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Input
                placeholder="Search history..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10 text-xs"
              />
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
            </div>
          </div>

          <Tabs defaultValue="analyses">
            <TabsList className="grid grid-cols-4 max-w-xl">
              <TabsTrigger value="analyses" className="text-xs">
                Analyses ({historyData.analyses.length})
              </TabsTrigger>
              <TabsTrigger value="drafts" className="text-xs">
                Drafts ({historyData.generatedPapers.length})
              </TabsTrigger>
              <TabsTrigger value="comparisons" className="text-xs">
                Matrices ({historyData.comparisons.length})
              </TabsTrigger>
              <TabsTrigger value="saved" className="text-xs">
                Saved ({historyData.savedPapers.length})
              </TabsTrigger>
            </TabsList>

            {/* Analyzed Papers Tab */}
            <TabsContent value="analyses" className="space-y-4">
              {filterItems(historyData.analyses).length === 0 ? (
                <Card className="p-10 text-center space-y-2">
                  <BookOpen className="w-8 h-8 text-muted-foreground/40 mx-auto" />
                  <p className="text-sm font-semibold text-foreground">No paper analyses found</p>
                  <p className="text-xs text-muted-foreground">Upload your first PDF to generate structured insights.</p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {filterItems(historyData.analyses).map((item: any) => (
                    <Card key={item.id} className="p-4 flex items-center justify-between gap-4 hover:border-border transition-colors">
                      <div className="space-y-1 overflow-hidden">
                        <div className="flex items-center gap-2">
                          <Badge variant="brand" className="text-[10px]">Analysis</Badge>
                          <span className="text-xs font-bold text-foreground truncate">{item.title}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Confidence: {item.confidenceScore}% • Gap Prominence: {item.gapProminence}% • {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Link href={`/analyze`}>
                          <Button variant="outline" size="sm" className="h-8 text-xs">
                            Open
                          </Button>
                        </Link>
                        <button
                          onClick={() => deleteItem(item.id, "ANALYSIS")}
                          className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-muted"
                          title="Delete analysis"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Generated Drafts Tab */}
            <TabsContent value="drafts" className="space-y-4">
              {filterItems(historyData.generatedPapers).length === 0 ? (
                <Card className="p-10 text-center space-y-2">
                  <PenTool className="w-8 h-8 text-muted-foreground/40 mx-auto" />
                  <p className="text-sm font-semibold text-foreground">No generated research drafts found</p>
                  <p className="text-xs text-muted-foreground">Create your first 12-section research draft.</p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {filterItems(historyData.generatedPapers).map((item: any) => (
                    <Card key={item.id} className="p-4 flex items-center justify-between gap-4 hover:border-border transition-colors">
                      <div className="space-y-1 overflow-hidden">
                        <div className="flex items-center gap-2">
                          <Badge variant="brand" className="text-[10px]">Draft</Badge>
                          <span className="text-xs font-bold text-foreground truncate">{item.title}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {item.wordCount || 0} words • Citation Style: {item.citationStyle} • {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Link href={`/generate/${item.id}`}>
                          <Button variant="outline" size="sm" className="h-8 text-xs">
                            Open Editor
                          </Button>
                        </Link>
                        <button
                          onClick={() => deleteItem(item.id, "GENERATED_DRAFT")}
                          className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-muted"
                          title="Delete draft"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Comparisons Tab */}
            <TabsContent value="comparisons" className="space-y-4">
              {filterItems(historyData.comparisons).length === 0 ? (
                <Card className="p-10 text-center space-y-2">
                  <GitCompare className="w-8 h-8 text-muted-foreground/40 mx-auto" />
                  <p className="text-sm font-semibold text-foreground">No comparison matrices found</p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {filterItems(historyData.comparisons).map((item: any) => (
                    <Card key={item.id} className="p-4 flex items-center justify-between gap-4 hover:border-border transition-colors">
                      <div className="space-y-1 overflow-hidden">
                        <div className="flex items-center gap-2">
                          <Badge variant="brand" className="text-[10px]">Comparison</Badge>
                          <span className="text-xs font-bold text-foreground truncate">{item.title}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Link href="/compare">
                          <Button variant="outline" size="sm" className="h-8 text-xs">
                            View Matrix
                          </Button>
                        </Link>
                        <button
                          onClick={() => deleteItem(item.id, "COMPARISON")}
                          className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-muted"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Saved Papers Tab */}
            <TabsContent value="saved" className="space-y-4">
              {filterItems(historyData.savedPapers).length === 0 ? (
                <Card className="p-10 text-center space-y-2">
                  <Bookmark className="w-8 h-8 text-muted-foreground/40 mx-auto" />
                  <p className="text-sm font-semibold text-foreground">No saved papers</p>
                </Card>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {filterItems(historyData.savedPapers).map((item: any) => (
                    <Card key={item.id} className="p-4 flex items-center justify-between gap-4 hover:border-border transition-colors">
                      <div className="space-y-1 overflow-hidden">
                        <h4 className="text-xs font-bold text-foreground truncate">{item.title}</h4>
                        <p className="text-[11px] text-muted-foreground">
                          {item.authors?.join(", ")} • {item.year}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {item.sourceUrl && (
                          <a
                            href={item.sourceUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
                          >
                            Source <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        <button
                          onClick={() => deleteItem(item.id, "SAVED_PAPER")}
                          className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-muted"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
