/**
 * High-performance in-memory server-side cache with TTL (Time To Live).
 * Prevents hitting OpenAlex rate limits and accelerates repeated queries,
 * paper detail lookups, and institution resolution.
 */

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

class OpenAlexMemoryCache {
  private cache = new Map<string, CacheEntry<any>>();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Periodic garbage collection every 10 minutes to prevent memory leaks
    if (typeof setInterval !== "undefined") {
      this.cleanupInterval = setInterval(() => this.purgeExpired(), 10 * 60 * 1000);
      if (this.cleanupInterval.unref) {
        this.cleanupInterval.unref();
      }
    }
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.value as T;
  }

  set<T>(key: string, value: T, ttlSeconds = 3600): void {
    const expiresAt = Date.now() + ttlSeconds * 1000;
    this.cache.set(key, { value, expiresAt });
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  private purgeExpired(): void {
    const now = Date.now();
    this.cache.forEach((entry, key) => {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    });
  }
}

// Global singleton cache across requests in Node server
const globalForCache = globalThis as unknown as { openAlexCache?: OpenAlexMemoryCache };
export const openAlexCache = globalForCache.openAlexCache ?? new OpenAlexMemoryCache();
if (process.env.NODE_ENV !== "production") globalForCache.openAlexCache = openAlexCache;
