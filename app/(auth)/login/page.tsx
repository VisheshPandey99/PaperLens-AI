"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Sparkles, ArrowRight, Lock, Mail, AlertCircle, CheckCircle2, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const urlError = searchParams.get("error");
  const registered = searchParams.get("registered") === "true";

  const getInitialError = (errorCode: string | null) => {
    if (!errorCode) return "";
    switch (errorCode) {
      case "Configuration":
        return "Google Sign-In is not configured yet. Please provide GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your .env file, or use a Quick Demo Account above.";
      case "AccessDenied":
        return "Access was denied. Please try again or use an academic demo account.";
      case "OAuthSignin":
      case "OAuthCallback":
        return "Unable to sign in with Google. Check your Google Cloud OAuth credentials in .env.";
      case "CredentialsSignin":
        return "Invalid email or password. Please check your credentials.";
      default:
        return errorCode.length < 100 ? errorCode : "An error occurred during authentication.";
    }
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(getInitialError(urlError));

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError(res.error);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred during sign in.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (demoEmail: string) => {
    setLoading(true);
    setError("");
    setEmail(demoEmail);
    setPassword("password123");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: demoEmail,
        password: "password123",
      });

      if (res?.error) {
        setError(res.error);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      setError("Failed to sign in with demo account.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    setError("");
    const isGoogleConfigured = process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === "true";
    if (!isGoogleConfigured) {
      setError(
        "Google Sign-In is not configured yet. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env to enable Google OAuth. For immediate testing, click one of the Quick Demo Accounts above!"
      );
      return;
    }
    signIn("google", { callbackUrl });
  };

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Brand Logo & Title */}
      <div className="text-center space-y-2">
        <Link href="/" className="inline-flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-bold text-xl tracking-tight text-foreground">
            PaperLens <span className="text-blue-600 font-extrabold text-sm uppercase">AI</span>
          </span>
        </Link>
        <h1 className="text-2xl font-bold text-foreground">Sign In to Your Workspace</h1>
        <p className="text-xs text-muted-foreground">
          Access your research papers, comparisons, and generated drafts.
        </p>
      </div>

      {/* Demo Accounts Quick-Fill Pill */}
      <Card className="p-4 bg-muted/40 border-dashed border-border/80 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-blue-600" />
            Quick Demo Accounts
          </span>
          <span className="text-[10px] text-muted-foreground">One-click test</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleQuickDemoLogin("demo@paperlens.ai")}
            className="p-2 rounded-lg border border-border bg-card text-left hover:border-blue-500 transition-colors"
          >
            <div className="text-xs font-semibold text-foreground">Dr. Elena Rostova</div>
            <div className="text-[10px] text-muted-foreground">Free Tier (3/5 left)</div>
          </button>

          <button
            type="button"
            onClick={() => handleQuickDemoLogin("premium@paperlens.ai")}
            className="p-2 rounded-lg border border-blue-500/30 bg-blue-50/50 dark:bg-blue-950/20 text-left hover:border-blue-500 transition-colors"
          >
            <div className="text-xs font-semibold text-foreground">Prof. Marcus Vance</div>
            <div className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">Pro Unlimited</div>
          </button>
        </div>
      </Card>

      {/* Form Card */}
      <Card className="p-6 md:p-8 space-y-5 shadow-xl">
        {registered && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-600 dark:text-emerald-400 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
            <span>Account created successfully! Please sign in with your academic credentials below.</span>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-xs text-destructive flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Academic Email</label>
            <div className="relative">
              <Input
                type="email"
                placeholder="scholar@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9"
                required
              />
              <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-3.5" />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-foreground">Password</label>
              <Link href="#" className="text-[11px] text-brand-600 dark:text-brand-400 hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9"
                required
              />
              <Lock className="w-4 h-4 text-muted-foreground absolute left-3 top-3.5" />
            </div>
          </div>

          <Button type="submit" variant="academic" className="w-full h-11 font-semibold" disabled={loading}>
            {loading ? "Signing In..." : "Sign In to Workspace"}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase">
            <span className="bg-card px-2 text-muted-foreground font-semibold">Or continue with</span>
          </div>
        </div>

        {/* Google OAuth button */}
        <Button
          type="button"
          variant="outline"
          className="w-full h-11 font-medium gap-2 text-xs"
          onClick={handleGoogleSignIn}
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          Sign in with Google
        </Button>
      </Card>

      {/* Footer */}
      <p className="text-center text-xs text-muted-foreground">
        Don&apos;t have an academic account?{" "}
        <Link href="/signup" className="font-semibold text-brand-600 dark:text-brand-400 hover:underline">
          Sign up free (5 analyses included)
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-background academic-grid">
      <Suspense fallback={<div className="text-sm text-muted-foreground">Loading workspace sign in...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
