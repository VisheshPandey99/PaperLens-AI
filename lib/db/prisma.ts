import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export function getResolvedDatabaseUrl(): string {
  const rawUrl = process.env.DATABASE_URL?.trim();

  // If using PostgreSQL or another non-SQLite provider, return as-is
  if (rawUrl && !rawUrl.startsWith("file:") && (rawUrl.includes("://") || rawUrl.startsWith("postgres"))) {
    return rawUrl;
  }

  // Candidate locations for the SQLite database
  const searchCandidates = [
    path.resolve(process.cwd(), "prisma", "dev.db"),
    path.resolve(process.cwd(), "dev.db"),
    path.resolve(__dirname, "../../prisma/dev.db"),
    path.resolve(__dirname, "../../../prisma/dev.db"),
    path.resolve(__dirname, "dev.db"),
  ];

  // If rawUrl specifies a relative path (e.g. file:./dev.db)
  if (rawUrl && rawUrl.startsWith("file:")) {
    const rawPath = rawUrl.replace(/^file:/, "").replace(/^\.\//, "");
    if (rawPath) {
      searchCandidates.unshift(path.resolve(process.cwd(), rawPath));
      if (!rawPath.startsWith("prisma/")) {
        searchCandidates.unshift(path.resolve(process.cwd(), "prisma", rawPath));
      }
    }
  }

  const formatSqliteUrl = (filePath: string) => {
    const cleanPath = filePath.replace(/\\/g, "/");
    return cleanPath.includes("?") ? `file:${cleanPath}` : `file:${cleanPath}?connection_limit=1`;
  };

  // On Vercel / AWS Lambda (serverless environment where root filesystem is read-only)
  const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
  if (isServerless) {
    const tmpDbPath = path.resolve("/tmp", "dev.db");

    // Copy bundled seed database into writable /tmp on container initialization
    if (!fs.existsSync(tmpDbPath)) {
      for (const candidate of searchCandidates) {
        try {
          if (fs.existsSync(candidate)) {
            fs.copyFileSync(candidate, tmpDbPath);
            break;
          }
        } catch (copyErr) {
          console.warn("Could not copy bundled database to /tmp:", copyErr);
        }
      }
    }

    if (fs.existsSync(tmpDbPath)) {
      return formatSqliteUrl(tmpDbPath);
    }
  }

  // Pick the first candidate file that physically exists
  for (const candidate of searchCandidates) {
    try {
      if (fs.existsSync(candidate)) {
        return formatSqliteUrl(candidate);
      }
    } catch {
      // Ignore filesystem permission or access check errors
    }
  }

  // Fallback: Ensure prisma directory exists and use prisma/dev.db
  const fallbackPath = path.resolve(process.cwd(), "prisma", "dev.db");
  try {
    const prismaDir = path.dirname(fallbackPath);
    if (!fs.existsSync(prismaDir)) {
      fs.mkdirSync(prismaDir, { recursive: true });
    }
  } catch (e) {
    console.warn("Could not create prisma directory for database fallback:", e);
  }

  return formatSqliteUrl(fallbackPath);
}

const resolvedDbUrl = getResolvedDatabaseUrl();

// Ensure process.env.DATABASE_URL is always populated so Prisma schema env("DATABASE_URL") validation succeeds
process.env.DATABASE_URL = resolvedDbUrl;
process.env["DATABASE_URL"] = resolvedDbUrl;

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: resolvedDbUrl,
      },
    },
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

