import path from "path";

// Sanitize NEXTAUTH_URL to prevent NextAuth "TypeError: Invalid URL (input: '')" during static prerendering
const rawAuthUrl = process.env.NEXTAUTH_URL;
const vercelUrl = process.env.VERCEL_URL;

let resolvedAuthUrl = "http://localhost:3000";
if (rawAuthUrl && rawAuthUrl.trim() !== "") {
  resolvedAuthUrl = rawAuthUrl.startsWith("http") ? rawAuthUrl.trim() : `https://${rawAuthUrl.trim()}`;
} else if (vercelUrl && vercelUrl.trim() !== "") {
  resolvedAuthUrl = `https://${vercelUrl.trim()}`;
}

process.env.NEXTAUTH_URL = resolvedAuthUrl;

// Sanitize DATABASE_URL so Prisma never throws an empty URL validation error
let resolvedDbUrl = process.env.DATABASE_URL?.trim();
if (!resolvedDbUrl || resolvedDbUrl === "" || resolvedDbUrl.startsWith("file:")) {
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    resolvedDbUrl = "file:/tmp/dev.db?connection_limit=1";
  } else {
    const relativePart = resolvedDbUrl?.startsWith("file:")
      ? resolvedDbUrl.replace(/^file:/, "").replace(/^\.\//, "")
      : "dev.db";
    const targetPath =
      relativePart && relativePart !== "dev.db" && !relativePart.startsWith("prisma/")
        ? path.resolve(process.cwd(), "prisma", relativePart)
        : path.resolve(process.cwd(), relativePart?.startsWith("prisma/") ? relativePart : "prisma/dev.db");
    const cleanDbPath = targetPath.replace(/\\/g, "/");
    resolvedDbUrl = cleanDbPath.includes("?") ? `file:${cleanDbPath}` : `file:${cleanDbPath}?connection_limit=1`;
  }
  process.env.DATABASE_URL = resolvedDbUrl;
}

const isGoogleAuthEnabled = Boolean(
  process.env.GOOGLE_CLIENT_ID &&
  process.env.GOOGLE_CLIENT_ID.trim() !== "" &&
  process.env.GOOGLE_CLIENT_SECRET &&
  process.env.GOOGLE_CLIENT_SECRET.trim() !== ""
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXTAUTH_URL: resolvedAuthUrl,
    NEXT_PUBLIC_GOOGLE_AUTH_ENABLED: isGoogleAuthEnabled ? "true" : "false",
  },
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs', 'docx', 'jspdf'],
    outputFileTracingIncludes: {
      '/**': ['./prisma/dev.db'],
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
};

export default nextConfig;
