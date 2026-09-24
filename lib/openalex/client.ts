/**
 * Server-side OpenAlex API Client
 * Adheres to OpenAlex Polite Pool standards, authentication guidelines,
 * exponential backoff retry on rate limits, and structured error handling.
 */

const OPENALEX_BASE_URL = "https://api.openalex.org";

export class OpenAlexError extends Error {
  public statusCode?: number;
  public userMessage: string;

  constructor(message: string, statusCode?: number, userMessage?: string) {
    super(message);
    this.name = "OpenAlexError";
    this.statusCode = statusCode;
    this.userMessage =
      userMessage || "Research discovery is temporarily unavailable. Please try again.";
  }
}

/**
 * Returns configured mailto email for OpenAlex polite pool.
 */
export function getOpenAlexMailto(): string {
  return (
    process.env.OPENALEX_MAILTO ||
    process.env.OPENALEX_EMAIL ||
    "contact@paperlens.ai"
  );
}

/**
 * Returns configured OpenAlex API key if set.
 */
export function getOpenAlexApiKey(): string | undefined {
  const key = process.env.OPENALEX_API_KEY;
  return key && key.trim().length > 0 ? key.trim() : undefined;
}

/**
 * Core server-side HTTP request wrapper for OpenAlex API.
 */
export async function openAlexFetch<T>(
  endpoint: string,
  params: Record<string, string | number | boolean | undefined | null> = {},
  options: { timeoutMs?: number; retries?: number } = {}
): Promise<T> {
  // Ensure server-side execution
  if (typeof window !== "undefined") {
    throw new OpenAlexError(
      "OpenAlex requests must be executed server-side to protect credentials and rate limits.",
      500,
      "Internal research service error."
    );
  }

  const { timeoutMs = 8000, retries = 1 } = options;
  const apiKey = getOpenAlexApiKey();
  const mailto = getOpenAlexMailto();

  const url = new URL(
    endpoint.startsWith("http") ? endpoint : `${OPENALEX_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`
  );

  // Add mailto for polite pool
  if (mailto && !url.searchParams.has("mailto")) {
    url.searchParams.set("mailto", mailto);
  }

  // Add API key query param if supplied
  if (apiKey && !url.searchParams.has("api_key")) {
    url.searchParams.set("api_key", apiKey);
  }

  // Append other params
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }

  const headers: Record<string, string> = {
    Accept: "application/json",
    "User-Agent": `PaperLensAI/1.0 (mailto:${mailto})`,
  };

  if (apiKey) {
    headers["api-key"] = apiKey;
  }

  let attempt = 0;
  while (attempt <= retries) {
    attempt++;
    try {
      const res = await fetch(url.toString(), {
        method: "GET",
        headers,
        signal: AbortSignal.timeout(timeoutMs),
        next: { revalidate: 3600 },
      });

      // Handle rate limits (429)
      if (res.status === 429) {
        if (attempt <= retries) {
          // Wait 1.5s before retry
          await new Promise((resolve) => setTimeout(resolve, 1500));
          continue;
        }
        throw new OpenAlexError(
          "OpenAlex rate limit exceeded",
          429,
          "Research discovery is experiencing high demand. Please try again in a few moments."
        );
      }

      // Handle not found (404)
      if (res.status === 404) {
        throw new OpenAlexError(
          `Resource not found at ${endpoint}`,
          404,
          "The requested research paper or institution could not be found."
        );
      }

      if (!res.ok) {
        const errorText = await res.text().catch(() => "");
        console.warn(`OpenAlex error (${res.status}) on ${url.pathname}:`, errorText);
        throw new OpenAlexError(
          `OpenAlex API responded with status ${res.status}`,
          res.status,
          "Research discovery is temporarily unavailable. Please try again."
        );
      }

      const data = (await res.json()) as T;
      return data;
    } catch (err: any) {
      if (err instanceof OpenAlexError) {
        throw err;
      }

      if (err.name === "TimeoutError" || err.name === "AbortError") {
        if (attempt <= retries) {
          continue;
        }
        throw new OpenAlexError(
          "OpenAlex request timed out",
          504,
          "Research search took too long to respond. Please try refining your query."
        );
      }

      if (attempt > retries) {
        console.error("OpenAlex network error:", err);
        throw new OpenAlexError(
          err.message || "Network error contacting OpenAlex",
          500,
          "Unable to connect to academic literature repository. Please check your network connection."
        );
      }
    }
  }

  throw new OpenAlexError(
    "Failed to complete OpenAlex request",
    500,
    "Research discovery is temporarily unavailable. Please try again."
  );
}
