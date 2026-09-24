import { z } from "zod";

export interface PaperGenerationPrompt {
  topic: string;
  problem: string;
  objective: string;
  field: string;
  methodology: string;
  targetLengthWords: number; // e.g., 2000, 3000, 5000
  citationStyle: "APA" | "IEEE" | "Harvard" | "MLA" | "Chicago";
  additionalInstructions?: string;
  verifiedLiterature?: VerifiedCitation[];
}

export interface PaperSection {
  id: string;
  title: string;
  sectionNumber: string; // e.g. "1", "2", "3" or "ABSTRACT"
  content: string;
  isGenerating?: boolean;
}

export interface VerifiedCitation {
  id: string;
  citationKey: string; // e.g. "Vaswani et al., 2017"
  title: string;
  authors: string[];
  year: number;
  venue?: string;
  doi?: string;
  sourceUrl?: string;
  verified: boolean; // Must be true if from Semantic Scholar / OpenAlex / Crossref
}

export interface GeneratedDraft {
  id: string;
  title: string;
  abstract: string;
  keywords: string[];
  sections: PaperSection[];
  citations: VerifiedCitation[];
  citationStyle: string;
  wordCount: number;
  status: "DRAFT" | "FINALIZED";
  createdAt: string;
  updatedAt: string;
}

// Zod schema for generating paper draft
export const GenerationDraftSchema = z.object({
  title: z.string(),
  abstract: z.string(),
  keywords: z.array(z.string()),
  sections: z.array(
    z.object({
      id: z.string(),
      sectionNumber: z.string(),
      title: z.string(),
      content: z.string(),
    })
  ),
  citations: z.array(
    z.object({
      id: z.string(),
      citationKey: z.string(),
      title: z.string(),
      authors: z.array(z.string()),
      year: z.number(),
      venue: z.string().optional(),
      doi: z.string().optional(),
      sourceUrl: z.string().optional(),
      verified: z.boolean().default(true),
    })
  ),
});
