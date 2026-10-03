import { PrismaClient } from "@prisma/client";
import path from "path";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getResolvedDatabaseUrl(): string {
  const rawUrl = process.env.DATABASE_URL?.trim();
  if (rawUrl && rawUrl !== "") {
    // If it's a relative SQLite file URL (e.g. "file:./dev.db" or "file:./prisma/dev.db")
    if (rawUrl.startsWith("file:./")) {
      const relativePart = rawUrl.replace(/^file:\.\//, "");
      const targetPath = relativePart.startsWith("prisma/")
        ? path.resolve(process.cwd(), relativePart)
        : path.resolve(process.cwd(), "prisma", relativePart);
      return `file:${targetPath.replace(/\\/g, "/")}`;
    }
    return rawUrl;
  }

  // Fallback to local SQLite database in prisma/dev.db
  const defaultDbPath = path.resolve(process.cwd(), "prisma", "dev.db").replace(/\\/g, "/");
  return `file:${defaultDbPath}`;
}

const resolvedDbUrl = getResolvedDatabaseUrl();

// Ensure process.env.DATABASE_URL is always populated so Prisma schema env("DATABASE_URL") validation succeeds
if (!process.env.DATABASE_URL || process.env.DATABASE_URL.trim() === "") {
  process.env["DATABASE_URL"] = resolvedDbUrl;
}

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

