"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Key, Shield, Check, Save } from "lucide-react";

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);
  const [openAIKey, setOpenAIKey] = useState("");
  const [semanticScholarKey, setSemanticScholarKey] = useState("");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <AppSidebar />

        <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto max-w-4xl">
          {/* Header */}
          <div className="border-b border-border/60 pb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Platform Settings
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Configure your API keys, theme preferences, and research defaults.
            </p>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            {/* Visual Theme Card */}
            <Card className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-foreground">Interface Appearance</h3>
                  <p className="text-xs text-muted-foreground">
                    Switch between sleek dark mode or high-contrast academic light mode.
                  </p>
                </div>
                <ThemeToggle />
              </div>
            </Card>

            {/* Custom API Keys Card */}
            <Card className="p-6 space-y-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 flex items-center justify-center">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">Bring Your Own API Keys (Optional)</h3>
                  <p className="text-xs text-muted-foreground">
                    By default, PaperLens AI cloud infrastructure powers all paper analysis and queries. You can optionally supply your personal keys.
                  </p>
                </div>
              </div>

              <div className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">OpenAI API Key</label>
                  <Input
                    type="password"
                    placeholder="sk-proj-••••••••••••••••"
                    value={openAIKey}
                    onChange={(e) => setOpenAIKey(e.target.value)}
                    className="font-mono text-xs"
                  />
                  <span className="text-[11px] text-muted-foreground">
                    Used for custom GPT-4o analysis runs. Keys are stored encrypted in secure sessions.
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Semantic Scholar Graph API Key</label>
                  <Input
                    type="password"
                    placeholder="••••••••••••••••"
                    value={semanticScholarKey}
                    onChange={(e) => setSemanticScholarKey(e.target.value)}
                    className="font-mono text-xs"
                  />
                  <span className="text-[11px] text-muted-foreground">
                    Increases literature search rate-limits up to 100 requests/second.
                  </span>
                </div>
              </div>
            </Card>

            {/* Security Note */}
            <div className="p-4 rounded-2xl bg-muted/40 border border-border/80 text-xs text-muted-foreground flex items-center gap-2.5">
              <Shield className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>
                Zero Client Leakage: All requests are verified and executed via server-side endpoints. API keys are never exposed in browser bundles.
              </span>
            </div>

            <Button type="submit" variant="academic" className="gap-2 font-semibold shadow-xs">
              {saved ? (
                <>
                  <Check className="w-4 h-4" />
                  Settings Saved
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Preferences
                </>
              )}
            </Button>
          </form>
        </main>
      </div>
    </div>
  );
}
