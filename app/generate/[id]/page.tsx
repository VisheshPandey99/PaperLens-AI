"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  FileText,
  Sparkles,
  Download,
  Copy,
  Save,
  Check,
  RotateCcw,
  Maximize2,
  Minimize2,
  GraduationCap,
  SpellCheck,
  HelpCircle,
  Plus,
  Trash2,
  ExternalLink,
  ArrowLeft,
  AlertCircle,
  FileDown,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export default function PaperEditorPage() {
  const params = useParams();
  const router = useRouter();
  const draftId = params.id as string;

  const [draft, setDraft] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Editable fields
  const [title, setTitle] = useState("");
  const [sections, setSections] = useState<any[]>([]);
  const [citations, setCitations] = useState<any[]>([]);

  useEffect(() => {
    if (!draftId) return;

    fetch(`/api/generate/${draftId}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.draft) {
          setDraft(data.draft);
          setTitle(data.draft.title);
          setSections(data.draft.sections || []);
          setCitations(data.draft.citations || []);
        }
      })
      .catch((err) => console.error("Error fetching draft:", err))
      .finally(() => setLoading(false));
  }, [draftId]);

  const handleSectionContentChange = (id: string, newContent: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, content: newContent } : s))
    );
  };

  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/generate/${draftId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          updatedTitle: title,
          updatedSections: sections,
        }),
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2500);
      }
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleAISectionAction = async (
    sectionId: string,
    sectionTitle: string,
    currentContent: string,
    action: "expand" | "shorten" | "academic-tone" | "fix-grammar" | "explain"
  ) => {
    setActionLoading(`${sectionId}-${action}`);
    try {
      const res = await fetch(`/api/generate/${draftId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          sectionTitle,
          currentContent,
        }),
      });

      const data = await res.json();
      if (res.ok && data.refinedText) {
        setSections((prev) =>
          prev.map((s) => (s.id === sectionId ? { ...s, content: data.refinedText } : s))
        );
      }
    } catch (err) {
      console.error("AI action failed:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const exportPDF = async () => {
    try {
      const res = await fetch("/api/export/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          abstract: draft?.abstract,
          sections,
          citations,
        }),
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${title.slice(0, 30).replace(/[^a-zA-Z0-9]/g, "_")}.pdf`;
        a.click();
      }
    } catch (err) {
      console.error("PDF export error:", err);
    }
  };

  const exportDOCX = async () => {
    try {
      const res = await fetch("/api/export/docx", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          abstract: draft?.abstract,
          sections,
          citations,
        }),
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${title.slice(0, 30).replace(/[^a-zA-Z0-9]/g, "_")}.docx`;
        a.click();
      }
    } catch (err) {
      console.error("DOCX export error:", err);
    }
  };

  const copyDraftToClipboard = () => {
    const fullText = `# ${title}\n\n## Abstract\n${draft?.abstract || ""}\n\n` +
      sections.map((s) => `### ${s.sectionNumber ? s.sectionNumber + ". " : ""}${s.title}\n${s.content}`).join("\n\n") +
      `\n\n### References\n` +
      citations.map((c) => `• ${c.authors?.join(", ")} (${c.year}). ${c.title}.`).join("\n");

    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-3 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-medium text-foreground">Loading research paper draft...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!draft) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Card className="p-8 text-center space-y-4 max-w-md">
            <AlertCircle className="w-8 h-8 text-destructive mx-auto" />
            <h3 className="text-lg font-bold text-foreground">Draft Not Found</h3>
            <p className="text-xs text-muted-foreground">
              This research draft may have been deleted or moved.
            </p>
            <Link href="/generate">
              <Button variant="outline" size="sm">
                Return to Generator
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <AppSidebar />

        <main className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto">
          {/* Top Bar Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-5">
            <div className="flex items-center gap-3">
              <Link href="/generate">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-500">
                  Interactive Paper Draft Editor
                </span>
                <h1 className="text-xl font-bold text-foreground truncate max-w-lg">
                  {title || "Untitled Research Draft"}
                </h1>
              </div>
            </div>

            {/* Editor Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={copyDraftToClipboard}
                className="h-9 text-xs gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied" : "Copy Text"}
              </Button>

              <Button variant="outline" size="sm" onClick={exportPDF} className="h-9 text-xs gap-1.5">
                <FileDown className="w-3.5 h-3.5" />
                Export PDF
              </Button>

              <Button variant="outline" size="sm" onClick={exportDOCX} className="h-9 text-xs gap-1.5">
                <Download className="w-3.5 h-3.5" />
                Export DOCX
              </Button>

              <Button
                variant="academic"
                size="sm"
                onClick={handleSaveDraft}
                disabled={saving}
                className="h-9 text-xs gap-1.5 font-semibold shadow-xs"
              >
                {saveSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Saved!
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    {saving ? "Saving..." : "Save Draft"}
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Academic Integrity Disclaimer Banner */}
          <div className="p-3.5 rounded-2xl border border-blue-500/20 bg-blue-50/50 dark:bg-blue-950/20 text-xs text-muted-foreground flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
            <span>
              <strong>Academic Integrity Notice:</strong> AI-generated research draft — verify all claims, citations, and statistical metrics before academic or journal submission.
            </span>
          </div>

          {/* Title Editor */}
          <Card className="p-6 space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Research Paper Title
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg font-bold text-foreground h-12"
            />
          </Card>

          {/* Abstract Block */}
          {draft.abstract && (
            <Card className="p-6 space-y-3 bg-muted/20">
              <span className="text-xs font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider">
                Abstract
              </span>
              <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed italic">
                {draft.abstract}
              </p>
            </Card>
          )}

          {/* 12 Sections with In-Place Editing and AI Assistant Toolbar */}
          <div className="space-y-6">
            {sections.map((section) => (
              <Card key={section.id} className="p-6 space-y-4 hover:border-border transition-colors">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/40 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-brand-500 font-mono">
                      {section.sectionNumber ? section.sectionNumber + "." : ""}
                    </span>
                    <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">
                      {section.title}
                    </h3>
                  </div>

                  {/* Per-Section AI Quick Actions */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-[11px] gap-1"
                      onClick={() =>
                        handleAISectionAction(section.id, section.title, section.content, "expand")
                      }
                      disabled={actionLoading !== null}
                    >
                      <Maximize2 className="w-3 h-3 text-blue-600" />
                      Expand
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-[11px] gap-1"
                      onClick={() =>
                        handleAISectionAction(section.id, section.title, section.content, "shorten")
                      }
                      disabled={actionLoading !== null}
                    >
                      <Minimize2 className="w-3 h-3 text-blue-600" />
                      Shorten
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-[11px] gap-1"
                      onClick={() =>
                        handleAISectionAction(section.id, section.title, section.content, "academic-tone")
                      }
                      disabled={actionLoading !== null}
                    >
                      <GraduationCap className="w-3 h-3 text-amber-500" />
                      Academic Tone
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-[11px] gap-1"
                      onClick={() =>
                        handleAISectionAction(section.id, section.title, section.content, "fix-grammar")
                      }
                      disabled={actionLoading !== null}
                    >
                      <SpellCheck className="w-3 h-3 text-emerald-500" />
                      Fix Grammar
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-[11px] gap-1"
                      onClick={() =>
                        handleAISectionAction(section.id, section.title, section.content, "explain")
                      }
                      disabled={actionLoading !== null}
                    >
                      <HelpCircle className="w-3 h-3 text-sky-500" />
                      Explain
                    </Button>
                  </div>
                </div>

                {/* Section Content Area */}
                <Textarea
                  value={section.content}
                  onChange={(e) => handleSectionContentChange(section.id, e.target.value)}
                  className="min-h-[140px] text-xs sm:text-sm font-normal leading-relaxed bg-background/50 border-input"
                  rows={6}
                />
              </Card>
            ))}
          </div>

          {/* References & Verified Citations Block */}
          {citations.length > 0 && (
            <Card className="p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-border/40 pb-3">
                <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4 text-brand-500" />
                  References & Verified Citations
                </h3>
                <Badge variant="success" className="text-[10px]">
                  Verified Academic Literature
                </Badge>
              </div>

              <div className="space-y-3">
                {citations.map((cit: any, i: number) => (
                  <div
                    key={cit.id || i}
                    className="p-3.5 rounded-xl border border-border/80 bg-muted/20 flex items-start justify-between gap-4 text-xs"
                  >
                    <div className="space-y-1">
                      <p className="font-semibold text-foreground">
                        {cit.authors?.join(", ")} ({cit.year || "n.d."}). {cit.title}.
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {cit.venue ? `${cit.venue} • ` : ""}
                        {cit.doi ? `DOI: ${cit.doi}` : ""}
                      </p>
                    </div>

                    {cit.sourceUrl && (
                      <a
                        href={cit.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1 shrink-0"
                      >
                        View Source <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
}
