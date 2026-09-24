"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard,
  BookOpen,
  GitCompare,
  Search,
  PenTool,
  Clock,
  Settings,
  CreditCard,
  User,
  Sparkles,
  Zap,
  LogOut,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function AppSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const user = session?.user as any;
  const isPremium = user?.plan === "PREMIUM";
  const analysisCount = user?.analysisCount || 0;
  const maxFree = 5;
  const remaining = isPremium ? Infinity : Math.max(0, maxFree - analysisCount);

  const mainNavigation = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/analyze", label: "Analyze Paper", icon: BookOpen },
    { href: "/compare", label: "Compare Papers", icon: GitCompare },
    { href: "/papers", label: "Research Hub", icon: Search },
    { href: "/generate", label: "AI Paper Generator", icon: PenTool },
    { href: "/history", label: "Research History", icon: Clock },
  ];

  const secondaryNavigation = [
    { href: "/billing", label: "Billing & Plans", icon: CreditCard },
    { href: "/settings", label: "Settings", icon: Settings },
    { href: "/profile", label: "Academic Profile", icon: User },
  ];

  return (
    <aside className="w-64 border-r border-border/80 bg-card/50 backdrop-blur-sm flex flex-col shrink-0 h-[calc(100vh-4rem)] sticky top-16 select-none transition-all hidden md:flex">
      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div>
          <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">
            Research Command
          </div>
          <div className="space-y-1">
            {mainNavigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2.2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? "text-brand-500" : "opacity-70"}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-brand-500" />}
                </Link>
              );
            })}
          </div>
        </div>

        <div>
          <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground/70">
            Account & Preferences
          </div>
          <div className="space-y-1">
            {secondaryNavigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-brand-500/10 text-brand-600 dark:text-brand-400 font-semibold"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? "text-brand-500" : "opacity-70"}`} />
                    <span>{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Free Analysis Lifetime Progress & Upgrade Card */}
      <div className="p-4 border-t border-border/80 bg-background/50">
        {isPremium ? (
          <div className="rounded-xl border border-blue-500/20 bg-blue-50/60 dark:bg-blue-950/30 p-3.5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 fill-blue-600 text-blue-600" />
                PaperLens Pro
              </span>
              <Badge variant="brand" className="text-[10px] px-1.5 py-0">
                ACTIVE
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Unlimited analyses, deep gap detection & AI generation active.
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card p-3.5 space-y-2.5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground">Free Starter Credits</span>
              <span className="text-xs font-bold text-brand-600 dark:text-brand-400">
                {remaining} / {maxFree} left
              </span>
            </div>

            {/* Progress bar */}
            <Progress value={Math.max(0, 5 - analysisCount)} max={5} indicatorClassName="bg-amber-500" />

            <p className="text-[11px] text-muted-foreground leading-tight">
              {remaining === 0
                ? "All 5 starter analyses used. Upgrade for unlimited access."
                : `${remaining} lifetime free paper analyses remaining.`}
            </p>

            <Link href="/pricing" className="block pt-1">
              <Button
                variant={remaining === 0 ? "academic" : "outline"}
                size="sm"
                className="w-full text-xs h-8 font-medium gap-1.5"
              >
                <Sparkles className="w-3 h-3" />
                {remaining === 0 ? "Upgrade to Pro" : "Get Unlimited"}
              </Button>
            </Link>
          </div>
        )}

        {/* User Footer strip */}
        <div className="mt-3 pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
          <div className="truncate max-w-[140px]">
            <p className="font-semibold text-foreground truncate">{user?.name || "Scholar"}</p>
            <p className="truncate text-[10px]">{user?.email || "Academic User"}</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-destructive transition-colors"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
