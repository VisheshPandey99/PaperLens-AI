"use client";

import React, { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Sparkles, ArrowRight, Lock, Mail, User, AlertCircle, CheckCircle2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create account.");
        setLoading(false);
        return;
      }

      // Automatically sign in the user
      const loginRes = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (loginRes?.error) {
        router.push("/login?registered=true");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected network error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    setError("");
    const isGoogleConfigured = process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === "true";
    if (!isGoogleConfigured) {
      setError(
        "Google Sign-In is not configured yet. Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to .env, or create an account using the form above."
      );
      return;
    }
    signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-background academic-grid">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-foreground">
              PaperLens <span className="text-blue-600 font-extrabold text-sm uppercase">AI</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-foreground">Create Your Academic Account</h1>
          <p className="text-xs text-muted-foreground">
            Unlock 5 free lifetime research paper analyses immediately.
          </p>
        </div>

        {/* Free Credits Badge */}
        <div className="p-3.5 rounded-2xl border border-blue-500/20 bg-blue-50/60 dark:bg-blue-950/30 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold">
            <Sparkles className="w-4 h-4" />
            <span>5 Free Lifetime Analyses</span>
          </div>
          <Badge variant="brand" className="text-[10px]">
            Zero Cost
          </Badge>
        </div>

        {/* Form Card */}
        <Card className="p-6 md:p-8 space-y-5 shadow-xl">
          {error && (
            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-xs text-destructive flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Full Name / Academic Title</label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Dr. Alexander Wright"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-9"
                  required
                />
                <User className="w-4 h-4 text-muted-foreground absolute left-3 top-3.5" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Academic Email</label>
              <div className="relative">
                <Input
                  type="email"
                  placeholder="alexander@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9"
                  required
                />
                <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-3.5" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Password (min. 6 characters)</label>
              <div className="relative">
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-9"
                  minLength={6}
                  required
                />
                <Lock className="w-4 h-4 text-muted-foreground absolute left-3 top-3.5" />
              </div>
            </div>

            <Button type="submit" variant="academic" className="w-full h-11 font-semibold" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account & Get 5 Analyses"}
            </Button>
          </form>

          {/* Google OAuth */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-card px-2 text-muted-foreground font-semibold">Or sign up with</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full h-11 font-medium gap-2 text-xs"
            onClick={handleGoogleSignUp}
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
            Sign up with Google
          </Button>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-brand-600 dark:text-brand-400 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
