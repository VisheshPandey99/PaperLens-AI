import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers/AppProviders";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "PaperLens AI — Read Smarter. Research Deeper. Create Better.",
  description:
    "Production-grade AI research assistant for students, researchers, professors, and academic institutions. Analyze papers, detect hidden research gaps, compare studies, and generate verified research drafts.",
  keywords: [
    "AI research assistant",
    "paper analysis",
    "research gap finder",
    "academic paper generator",
    "literature review",
    "Semantic Scholar",
    "OpenAlex",
  ],
  authors: [{ name: "PaperLens AI" }],
  openGraph: {
    title: "PaperLens AI — Read Smarter. Research Deeper. Create Better.",
    description: "Analyze research papers, discover hidden research gaps, compare studies and generate research-ready drafts.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans min-h-screen antialiased bg-background text-foreground flex flex-col`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
