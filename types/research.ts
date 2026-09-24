export interface AcademicPaper {
  id: string;
  title: string;
  authors: string[];
  year: number;
  venue?: string;
  abstract: string;
  citationCount: number;
  doi?: string;
  isOpenAccess: boolean;
  pdfUrl?: string;
  sourceUrl: string;
  sourceProvider: "Semantic Scholar" | "OpenAlex" | "Crossref" | "CORE" | "Verified Database";
  fieldsOfStudy?: string[];
  openAlexId?: string;
  primaryInstitution?: string;
}

export interface ResearchSearchFilters {
  query: string;
  yearMin?: number;
  yearMax?: number;
  field?: string;
  openAccessOnly?: boolean;
  minCitations?: number;
  limit?: number;
  offset?: number;
}

export interface ResearchSearchResponse {
  papers: AcademicPaper[];
  total: number;
  query: string;
  source: string;
}
