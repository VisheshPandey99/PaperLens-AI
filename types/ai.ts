import { z } from "zod";

// Zod schema for structured Paper Analysis output
export const PaperAnalysisSchema = z.object({
  title: z.string().default("Untitled Research Paper"),
  authors: z.array(z.string()).default([]),
  overview: z.string().describe("Executive overview of the research paper"),
  problem: z.string().describe("Core problem and research challenge addressed"),
  objectives: z.string().describe("Specific aims and research questions"),
  methodology: z.string().describe("Methodology, techniques, architectures, or frameworks"),
  dataset: z.string().describe("Datasets, sample sizes, benchmarks, or data sources"),
  results: z.string().describe("Key metrics, quantitative and qualitative performance"),
  findings: z.string().describe("Major insights and scientific takeaways"),
  limitations: z.string().describe("Constraints, scope boundaries, and weaknesses"),
  researchGap: z.string().describe("Unresolved gaps in existing literature identified by this study"),
  futureWork: z.string().describe("Actionable directions for subsequent investigations"),
  recommendation: z.string().describe("Practical and academic recommendations for researchers"),
  confidenceScore: z.number().min(0).max(100).default(90),
  gapProminence: z.number().min(0).max(100).default(80),
  suggestedResearchQuestion: z.string().optional(),
  suggestedMethodology: z.string().optional(),
});

export type PaperAnalysisResult = z.infer<typeof PaperAnalysisSchema>;

// Similar Paper item definition
export interface SimilarPaper {
  id: string;
  title: string;
  authors: string[];
  year: number;
  venue?: string;
  doi?: string;
  sourceUrl?: string;
  citationCount?: number;
  isOpenAccess?: boolean;
  relevanceReason: string; // AI generated relevance reasoning
}

// Comparison Matrix item schema
export const ComparisonMatrixSchema = z.object({
  title: z.string(),
  papers: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      authors: z.array(z.string()),
      year: z.number().optional(),
      problem: z.string(),
      objectives: z.string(),
      methodology: z.string(),
      dataset: z.string(),
      algorithms: z.string(),
      results: z.string(),
      limitations: z.string(),
      researchGap: z.string(),
      futureWork: z.string(),
    })
  ),
  crossPaperGap: z.string().describe("Synthesis of unexplored gaps across all compared studies"),
  commonThemes: z.array(z.string()).optional(),
});

export type ComparisonResult = z.infer<typeof ComparisonMatrixSchema>;

// AI Research Advisor Schema
export const AdvisorOutputSchema = z.object({
  potentialDirections: z.array(z.string()),
  researchQuestions: z.array(z.string()),
  possibleMethodologies: z.array(z.string()),
  potentialDatasets: z.array(z.string()),
  relatedLiterature: z.array(
    z.object({
      title: z.string(),
      authors: z.string(),
      year: z.number().optional(),
      doi: z.string().optional(),
      sourceUrl: z.string().optional(),
      verified: z.boolean(),
    })
  ),
  suggestedExperiments: z.array(z.string()),
  potentialLimitations: z.array(z.string()),
});

export type AdvisorResult = z.infer<typeof AdvisorOutputSchema>;
