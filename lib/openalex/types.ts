import { AcademicPaper } from "@/types/research";

export interface OpenAlexLocationSource {
  id?: string;
  display_name?: string;
  issn_l?: string;
  type?: string;
  host_organization_name?: string;
}

export interface OpenAlexLocation {
  id?: string;
  is_oa?: boolean;
  landing_page_url?: string | null;
  pdf_url?: string | null;
  source?: OpenAlexLocationSource | null;
  version?: string | null;
  raw_source_name?: string | null;
}

export interface OpenAlexAuthorAffiliation {
  raw_affiliation_string?: string;
  institution_ids?: string[];
}

export interface OpenAlexAuthorship {
  author_position?: "first" | "middle" | "last";
  author: {
    id: string;
    display_name: string;
    orcid?: string | null;
  };
  institutions?: Array<{
    id: string;
    display_name: string;
    ror?: string;
    country_code?: string;
    type?: string;
  }>;
  countries?: string[];
  is_corresponding?: boolean;
  raw_affiliation_strings?: string[];
}

export interface OpenAlexTopic {
  id: string;
  display_name: string;
  score?: number;
  subfield?: { id: string; display_name: string };
  field?: { id: string; display_name: string };
  domain?: { id: string; display_name: string };
}

export interface OpenAlexConcept {
  id: string;
  wikidata?: string;
  display_name: string;
  level?: number;
  score?: number;
}

export interface OpenAlexWork {
  id: string; // e.g. "https://openalex.org/W2022485595"
  doi?: string | null;
  title?: string | null;
  display_name?: string | null;
  publication_year?: number | null;
  publication_date?: string | null;
  ids?: {
    openalex?: string;
    doi?: string;
    mag?: string;
    pmid?: string;
  };
  language?: string | null;
  primary_location?: OpenAlexLocation | null;
  type?: string | null;
  open_access?: {
    is_oa: boolean;
    oa_status: string;
    oa_url?: string | null;
    any_repository_has_fulltext?: boolean;
  } | null;
  authorships?: OpenAlexAuthorship[];
  cited_by_count?: number;
  primary_topic?: OpenAlexTopic | null;
  topics?: OpenAlexTopic[];
  concepts?: OpenAlexConcept[];
  locations?: OpenAlexLocation[];
  best_oa_location?: OpenAlexLocation | null;
  referenced_works?: string[];
  related_works?: string[];
  abstract_inverted_index?: Record<string, number[]> | null;
}

export interface OpenAlexSearchParams {
  query?: string;
  topic?: string;
  title?: string;
  author?: string;
  doi?: string;
  institutionId?: string;
  institutionName?: string;
  institutionType?: string;
  year?: number;
  yearMin?: number;
  yearMax?: number;
  openAccessOnly?: boolean;
  minCitations?: number;
  sort?: "relevance" | "citations" | "newest" | string;
  page?: number;
  limit?: number;
}

export interface OpenAlexSearchResponse {
  papers: AcademicPaper[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  query?: string;
  institutionResolved?: string;
  source: string;
}

export interface OpenAlexInstitutionResult {
  id: string; // "https://openalex.org/I68891433" or "I68891433"
  openAlexId: string; // clean short ID "I68891433"
  displayName: string;
  ror?: string | null;
  countryCode?: string | null;
  type?: string | null;
  worksCount?: number;
  citedByCount?: number;
  homepageUrl?: string | null;
  imageUrl?: string | null;
  acronym?: string;
}

export interface OpenAlexInstitutionResponse {
  meta: {
    count: number;
    db_response_time_ms?: number;
    page: number;
    per_page: number;
  };
  results: Array<{
    id: string;
    ror?: string;
    display_name: string;
    country_code?: string;
    type?: string;
    works_count?: number;
    cited_by_count?: number;
    homepage_url?: string;
    image_url?: string;
    display_name_acronyms?: string[];
  }>;
}
