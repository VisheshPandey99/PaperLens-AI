import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/prisma";

const hasGoogleAuth = Boolean(
  process.env.GOOGLE_CLIENT_ID &&
  process.env.GOOGLE_CLIENT_ID.trim() !== "" &&
  process.env.GOOGLE_CLIENT_SECRET &&
  process.env.GOOGLE_CLIENT_SECRET.trim() !== ""
);

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

        const inputEmail = credentials.email.toLowerCase().trim();
        let user: any = null;

        try {
          user = await prisma.user.findUnique({
            where: { email: inputEmail },
          });

          // Fallback for legacy database records with @researchlens.ai or @paperlens.ai
          if (!user) {
            const alternateEmail = inputEmail.includes("@paperlens.ai")
              ? inputEmail.replace("@paperlens.ai", "@researchlens.ai")
              : inputEmail.includes("@researchlens.ai")
              ? inputEmail.replace("@researchlens.ai", "@paperlens.ai")
              : null;

            if (alternateEmail) {
              user = await prisma.user.findUnique({
                where: { email: alternateEmail },
              });
            }
          }

          // If a demo account was requested but doesn't exist yet, seed on-demand
          if (!user && (inputEmail === "demo@paperlens.ai" || inputEmail === "premium@paperlens.ai")) {
            const { seedDatabase } = await import("@/lib/db/seed");
            await seedDatabase();
            user = await prisma.user.findUnique({
              where: { email: inputEmail },
            });
          }
        } catch (dbErr: any) {
          console.error("Database query failed during credentials authorization:", dbErr);
          throw new Error("Unable to access database. Please restart the dev server to refresh connection.");
        }

        if (!user) {
          throw new Error("No academic account found with this email.");
        }

        if (!user.passwordHash) {
          throw new Error("This account does not have a password set yet. Please sign in with Google or visit the Sign Up page to create a password.");
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
    ...(hasGoogleAuth
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!.trim(),
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!.trim(),
            allowDangerousEmailAccountLinking: true,
            authorization: {
              params: {
                prompt: "select_account",
                access_type: "offline",
                response_type: "code",
              },
            },
          }),
        ]
      : []),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        if (!user.email) return false;
        try {
          const email = user.email.toLowerCase().trim();
          let existingUser = await prisma.user.findUnique({
            where: { email },
          });

          if (!existingUser) {
            existingUser = await prisma.user.create({
              data: {
                name: user.name || "Academic Researcher",
                email,
                image: user.image,
                plan: "FREE",
                analysisCount: 0,
                subscriptionStatus: "INACTIVE",
              },
            });
          } else if (user.image && !existingUser.image) {
            await prisma.user.update({
              where: { id: existingUser.id },
              data: { image: user.image },
            });
          }

          // Link the database user ID so JWT gets the correct CUID
          user.id = existingUser.id;
          return true;
        } catch (error) {
          console.error("Error synchronizing Google user in database:", error);
          return false;
        }
      }
      return true;
    },
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
          let freshUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: { id: true, plan: true, analysisCount: true, subscriptionStatus: true },
          });

          // Fallback to match by email if token.id was set to provider account ID
          if (!freshUser && token.email) {
            freshUser = await prisma.user.findUnique({
              where: { email: (token.email as string).toLowerCase().trim() },
              select: { id: true, plan: true, analysisCount: true, subscriptionStatus: true },
            });
            if (freshUser) {
              token.id = freshUser.id;
            }
          }

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
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "researchlens-ai-secret-key-32-chars-minimum-for-security",
};

