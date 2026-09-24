import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/prisma";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "scholar@university.edu" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter both email and password.");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase().trim() },
        });

        if (!user || !user.passwordHash) {
          throw new Error("No academic account found with this email.");
        }

        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!isValid) {
          throw new Error("Incorrect password provided.");
        }

        return {
          id: user.id,
          name: user.name || "Academic Researcher",
          email: user.email,
          image: user.image,
          plan: user.plan,
          analysisCount: user.analysisCount,
          subscriptionStatus: user.subscriptionStatus,
        } as any;
      },
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.plan = (user as any).plan || "FREE";
        token.analysisCount = (user as any).analysisCount || 0;
        token.subscriptionStatus = (user as any).subscriptionStatus || "INACTIVE";
      }

      // Allow refreshing session data (e.g. after analysis count increment or upgrade)
      if (trigger === "update" && session) {
        if (session.plan) token.plan = session.plan;
        if (typeof session.analysisCount === "number") token.analysisCount = session.analysisCount;
        if (session.subscriptionStatus) token.subscriptionStatus = session.subscriptionStatus;
      }

      // Refresh latest user record from DB on token check
      if (token.id) {
        try {
          const freshUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: { plan: true, analysisCount: true, subscriptionStatus: true },
          });
          if (freshUser) {
            token.plan = freshUser.plan;
            token.analysisCount = freshUser.analysisCount;
            token.subscriptionStatus = freshUser.subscriptionStatus;
          }
        } catch {
          // fallback to current token if DB transiently unreachable
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).plan = token.plan || "FREE";
        (session.user as any).analysisCount = token.analysisCount ?? 0;
        (session.user as any).subscriptionStatus = token.subscriptionStatus || "INACTIVE";
        (session.user as any).remainingAnalyses =
          token.plan === "PREMIUM" ? Infinity : Math.max(0, 5 - ((token.analysisCount as number) || 0));
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    newUser: "/dashboard",
  },
  secret: process.env.NEXTAUTH_SECRET || "researchlens-ai-secret-key-32-chars-minimum-for-security",
};
