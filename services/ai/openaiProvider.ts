import OpenAI from "openai";
import {
  PaperAnalysisResult,
  PaperAnalysisSchema,
  ComparisonResult,
  ComparisonMatrixSchema,
  AdvisorResult,
  AdvisorOutputSchema,
} from "@/types/ai";
import { PaperGenerationPrompt, GeneratedDraft, GenerationDraftSchema } from "@/types/generator";
import { mockAnalyzePaper, mockComparePapers, mockAdviseResearch, mockGeneratePaperDraft, mockRefineSection } from "./mockAI";

function getOpenAIClient(): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey.trim() === "" || apiKey === "your-openai-api-key") {
    return null;
  }
  return new OpenAI({ apiKey });
}

export async function openaiAnalyzePaper(extractedText: string, filename?: string): Promise<PaperAnalysisResult> {
  const openai = getOpenAIClient();
  if (!openai) {
    return mockAnalyzePaper(extractedText, filename);
  }

  try {
    const prompt = `You are PaperLens AI, an elite academic research assistant.
Analyze the following academic paper text and return a strictly valid JSON object conforming to the schema.
Do NOT fabricate citations. Highlight real gaps, limitations, datasets, and methodologies.

SCHEMA REQUIREMENTS:
{
  "title": string,
  "authors": string[],
  "overview": string,
  "problem": string,
  "objectives": string,
  "methodology": string,
  "dataset": string,
  "results": string,
  "findings": string,
  "limitations": string,
  "researchGap": string,
  "futureWork": string,
  "recommendation": string,
  "confidenceScore": number (0-100),
  "gapProminence": number (0-100),
  "suggestedResearchQuestion": string,
  "suggestedMethodology": string
}

PAPER TEXT:
${extractedText.slice(0, 15000)}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.2,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No response from OpenAI");
    }

    const parsed = JSON.parse(content);
    return PaperAnalysisSchema.parse(parsed);
  } catch (error) {
    console.warn("OpenAI analysis failed, falling back to academic mock engine:", error);
    return mockAnalyzePaper(extractedText, filename);
  }
}

export async function openaiComparePapers(
  papers: Array<{ id: string; title: string; authors?: string[]; text?: string }>
): Promise<ComparisonResult> {
  const openai = getOpenAIClient();
  if (!openai) {
    return mockComparePapers(papers);
  }

  try {
    const prompt = `Compare these ${papers.length} research studies side-by-side. Identify common themes and the cross-study research gap. Return strictly valid JSON conforming to the schema.
    
PAPERS:
${papers.map((p, i) => `Paper ${i + 1}: ${p.title}\n${(p.text || "").slice(0, 2000)}`).join("\n\n---\n\n")}

SCHEMA:
{
  "title": string,
  "papers": [
    {
      "id": string,
      "title": string,
      "authors": string[],
      "year": number,
      "problem": string,
      "objectives": string,
      "methodology": string,
      "dataset": string,
      "algorithms": string,
      "results": string,
      "limitations": string,
      "researchGap": string,
      "futureWork": string
    }
  ],
  "crossPaperGap": string,
  "commonThemes": string[]
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.2,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error("No response from OpenAI");

    const parsed = JSON.parse(content);
    return ComparisonMatrixSchema.parse(parsed);
  } catch (error) {
    console.warn("OpenAI comparison failed, falling back to mock:", error);
    return mockComparePapers(papers);
  }
}

export async function openaiAdviseResearch(topic: string, gapSummary: string): Promise<AdvisorResult> {
  const openai = getOpenAIClient();
  if (!openai) {
    return mockAdviseResearch(topic, gapSummary);
  }

  try {
    const prompt = `Act as an AI Research Advisor for a researcher investigating: "${topic}".
Unresolved research gap: "${gapSummary}".
Provide structured research guidance, potential methodologies, experimental setups, and verified citations. Do not fabricate citations; if uncertain, provide standard benchmark references.
Return strictly valid JSON conforming to the schema.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error("No response from OpenAI");

    const parsed = JSON.parse(content);
    return AdvisorOutputSchema.parse(parsed);
  } catch (error) {
    console.warn("OpenAI advisor failed, falling back to mock:", error);
    return mockAdviseResearch(topic, gapSummary);
  }
}

export async function openaiGeneratePaperDraft(prompt: PaperGenerationPrompt): Promise<GeneratedDraft> {
  const openai = getOpenAIClient();
  if (!openai) {
    return mockGeneratePaperDraft(prompt);
  }

  try {
    const aiPrompt = `Generate a high-quality academic research draft paper.
IMPORTANT RULES:
1. Label experimental outcomes as "Expected Results", NOT real results.
2. Label clearly as an AI-generated draft.
3. Use real, verified citations where possible.
4. Provide structured sections conforming to:
TITLE, ABSTRACT, KEYWORDS, 1. INTRODUCTION, 2. LITERATURE REVIEW, 3. RESEARCH PROBLEM, 4. RESEARCH OBJECTIVES, 5. RESEARCH QUESTIONS, 6. METHODOLOGY, 7. PROPOSED SYSTEM / EXPERIMENT, 8. EXPECTED RESULTS, 9. DISCUSSION, 10. LIMITATIONS, 11. FUTURE WORK, 12. CONCLUSION, REFERENCES.

USER INPUT:
Topic: ${prompt.topic}
Problem: ${prompt.problem}
Objective: ${prompt.objective}
Field: ${prompt.field}
Methodology: ${prompt.methodology}
Target Length: ${prompt.targetLengthWords} words
Citation Style: ${prompt.citationStyle}
Additional Instructions: ${prompt.additionalInstructions || "None"}

VERIFIED LITERATURE FROM OPENALEX (Ground your Literature Review and Citations strictly on these real works, never fabricate):
${
  prompt.verifiedLiterature && prompt.verifiedLiterature.length > 0
    ? prompt.verifiedLiterature
        .map(
          (c) =>
            `- [${c.citationKey}] "${c.title}" by ${c.authors.join(", ")} (${c.year}), published in ${c.venue || "Academic venue"}, DOI: ${c.doi || "N/A"}, URL: ${c.sourceUrl || "N/A"}`
        )
        .join("\n")
    : "No external verified literature provided. Use only benchmark seminal works and do not invent fake DOIs or paper titles."
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: aiPrompt }],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error("No response from OpenAI");

    const parsed = JSON.parse(content);
    const validated = GenerationDraftSchema.parse(parsed);

    return {
      id: `draft-${Date.now()}`,
      title: validated.title,
      abstract: validated.abstract,
      keywords: validated.keywords,
      sections: validated.sections,
      citations: validated.citations,
      citationStyle: prompt.citationStyle || "APA",
      wordCount: validated.sections.reduce((acc, s) => acc + s.content.split(/\s+/).length, 0),
      status: "DRAFT",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.warn("OpenAI paper generation failed, falling back to mock:", error);
    return mockGeneratePaperDraft(prompt);
  }
}

export async function openaiRefineSection(
  sectionTitle: string,
  currentContent: string,
  action: "expand" | "shorten" | "academic-tone" | "fix-grammar" | "explain"
): Promise<string> {
  const openai = getOpenAIClient();
  if (!openai) {
    return mockRefineSection(sectionTitle, currentContent, action);
  }

  try {
    const prompt = `Refine the following section from an academic research paper:
Section Title: "${sectionTitle}"
Action Requested: "${action}" (options: expand, shorten, academic-tone, fix-grammar, explain)

Current Content:
${currentContent}

Output only the revised text for the section.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.3,
    });

    return response.choices[0]?.message?.content?.trim() || currentContent;
  } catch (error) {
    console.warn("OpenAI section refinement failed, falling back to mock:", error);
    return mockRefineSection(sectionTitle, currentContent, action);
  }
}
