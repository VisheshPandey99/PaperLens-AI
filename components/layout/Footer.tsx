import React from "react";
import Link from "next/link";
import { Sparkles, Shield, BookOpen, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/80 bg-card/60 backdrop-blur-sm text-foreground transition-colors mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/10">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg tracking-tight">
                PaperLens <span className="text-blue-600 font-extrabold text-sm uppercase">AI</span>
              </span>
            </Link>

            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              Read Smarter. Research Deeper. Create Better. The next-generation AI research platform engineered for university faculties, PhD researchers, academic laboratories, and rigorous science.
            </p>

            <div className="pt-2 text-xs text-muted-foreground/80 space-y-1">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Shield className="w-3.5 h-3.5 text-emerald-500" />
                <span>Zero Hallucination Protocol & Verified Academic Citations</span>
              </div>
              <p className="text-[11px] text-muted-foreground/60">
                Connected to Semantic Scholar, OpenAlex, and Crossref scientific repositories.
              </p>
            </div>
          </div>

          {/* Nav Column 1 */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/analyze" className="hover:text-foreground transition-colors">
                  Paper Analysis
                </Link>
              </li>
              <li>
                <Link href="/compare" className="hover:text-foreground transition-colors">
                  Cross-Study Comparison
                </Link>
              </li>
              <li>
                <Link href="/papers" className="hover:text-foreground transition-colors">
                  Academic Research Hub
                </Link>
              </li>
              <li>
                <Link href="/generate" className="hover:text-foreground transition-colors">
                  AI Paper Generator
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-foreground transition-colors">
                  Subscription Plans
                </Link>
              </li>
            </ul>
          </div>

          {/* Nav Column 2 */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Academic Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-foreground transition-colors">
                  About PaperLens
                </Link>
              </li>
              <li>
                <Link href="/features" className="hover:text-foreground transition-colors">
                  Feature Architecture
                </Link>
              </li>
              <li>
                <a
                  href="https://www.semanticscholar.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors inline-flex items-center gap-1"
                >
                  Semantic Scholar Graph <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href="https://openalex.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors inline-flex items-center gap-1"
                >
                  OpenAlex Catalog <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.crossref.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors inline-flex items-center gap-1"
                >
                  Crossref Metadata <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
            </ul>
          </div>

          {/* Nav Column 3 */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Trust & Integrity</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/contact" className="hover:text-foreground transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <span className="text-xs block text-muted-foreground">
                  Ethical AI Disclaimer: All generated paper sections are structured drafts. Verify empirical claims and citations before academic submission.
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} PaperLens AI. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>5 Lifetime Free Starter Analyses Included</span>
            <span>PCI-DSS Stripe Billing</span>
            <span>Next.js 14 App Router</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
