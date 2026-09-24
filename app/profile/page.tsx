"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { Navbar } from "@/components/layout/Navbar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { User, Check, Save, GraduationCap, Building2 } from "lucide-react";

export default function ProfilePage() {
  const { data: session } = useSession();

  const [name, setName] = useState(session?.user?.name || "Dr. Elena Rostova");
  const [email] = useState(session?.user?.email || "demo@paperlens.ai");
  const [institution, setInstitution] = useState("Institute for Advanced Study / Stanford AI Lab");
  const [field, setField] = useState("Artificial Intelligence & Computational Biology");
  const [orcid, setOrcid] = useState("0000-0002-1825-0097");
  const [saved, setSaved] = useState(false);

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
              Academic Scholar Profile
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your academic credentials, ORCID identifier, and institutional affiliations.
            </p>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <Card className="p-6 space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white text-xl font-bold shadow-md shadow-blue-500/20">
                  {name ? name.charAt(0) : "S"}
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-foreground">{name}</h3>
                  <p className="text-xs text-muted-foreground">{email}</p>
                  <Badge variant="brand" className="text-[10px]">
                    {(session?.user as any)?.plan === "PREMIUM" ? "Pro Scholar" : "Starter Scholar"}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-border/60">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Full Name & Title</label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} required />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Institutional Email</label>
                  <Input value={email} disabled className="bg-muted cursor-not-allowed text-xs" />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">University / Institution</label>
                  <Input value={institution} onChange={(e) => setInstitution(e.target.value)} />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Primary Field of Research</label>
                  <Input value={field} onChange={(e) => setField(e.target.value)} />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-foreground">ORCID Identifier</label>
                  <Input
                    placeholder="0000-0000-0000-0000"
                    value={orcid}
                    onChange={(e) => setOrcid(e.target.value)}
                    className="font-mono text-xs"
                  />
                  <span className="text-[11px] text-muted-foreground">
                    Used to automatically associate your published papers when searching in the Research Hub.
                  </span>
                </div>
              </div>
            </Card>

            <Button type="submit" variant="academic" className="gap-2 font-semibold shadow-xs">
              {saved ? (
                <>
                  <Check className="w-4 h-4" />
                  Profile Updated
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Scholar Profile
                </>
              )}
            </Button>
          </form>
        </main>
      </div>
    </div>
  );
}
