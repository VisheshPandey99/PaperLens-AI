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

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXTAUTH_URL: resolvedAuthUrl,
  },
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'bcryptjs', 'docx', 'jspdf'],
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
