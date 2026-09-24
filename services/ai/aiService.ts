import { PaperAnalysisResult, ComparisonResult, AdvisorResult } from "@/types/ai";
import { PaperGenerationPrompt, GeneratedDraft } from "@/types/generator";
import {
  openaiAnalyzePaper,
  openaiComparePapers,
  openaiAdviseResearch,
  openaiGeneratePaperDraft,
  openaiRefineSection,
} from "./openaiProvider";
import {
  mockAnalyzePaper,
  mockComparePapers,
  mockAdviseResearch,
  mockGeneratePaperDraft,
  mockRefineSection,
} from "./mockAI";

export interface AIService {
  analyzePaper(extractedText: string, filename?: string): Promise<PaperAnalysisResult>;
  comparePapers(papers: Array<{ id: string; title: string; authors?: string[]; text?: string }>): Promise<ComparisonResult>;
  adviseResearch(topic: string, gapSummary: string): Promise<AdvisorResult>;
  generateResearchPaper(prompt: PaperGenerationPrompt): Promise<GeneratedDraft>;
  refineSection(
    sectionTitle: string,
    currentContent: string,
    action: "expand" | "shorten" | "academic-tone" | "fix-grammar" | "explain"
  ): Promise<string>;
}

class AIServiceDispatcher implements AIService {
  private getProvider(): string {
    const provider = process.env.AI_PROVIDER?.toLowerCase() || "openai";
    const apiKey = process.env.OPENAI_API_KEY;
    if (provider === "openai" && (!apiKey || apiKey.trim() === "")) {
      return "mock";
    }
    return provider;
  }

  async analyzePaper(extractedText: string, filename?: string): Promise<PaperAnalysisResult> {
    if (this.getProvider() === "mock") {
      return mockAnalyzePaper(extractedText, filename);
    }
    return openaiAnalyzePaper(extractedText, filename);
  }

  async comparePapers(
    papers: Array<{ id: string; title: string; authors?: string[]; text?: string }>
  ): Promise<ComparisonResult> {
    if (this.getProvider() === "mock") {
      return mockComparePapers(papers);
    }
    return openaiComparePapers(papers);
  }

  async adviseResearch(topic: string, gapSummary: string): Promise<AdvisorResult> {
    if (this.getProvider() === "mock") {
      return mockAdviseResearch(topic, gapSummary);
    }
    return openaiAdviseResearch(topic, gapSummary);
  }

  async generateResearchPaper(prompt: PaperGenerationPrompt): Promise<GeneratedDraft> {
    if (this.getProvider() === "mock") {
      return mockGeneratePaperDraft(prompt);
    }
    return openaiGeneratePaperDraft(prompt);
  }

  async refineSection(
    sectionTitle: string,
    currentContent: string,
    action: "expand" | "shorten" | "academic-tone" | "fix-grammar" | "explain"
  ): Promise<string> {
    if (this.getProvider() === "mock") {
      return mockRefineSection(sectionTitle, currentContent, action);
    }
    return openaiRefineSection(sectionTitle, currentContent, action);
  }
}

export const aiService = new AIServiceDispatcher();
