import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db/prisma";
import { z } from "zod";

const RegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please provide a valid institutional or personal email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = RegisterSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: validated.error.errors[0]?.message || "Invalid registration data" },
        { status: 400 }
      );
    }

    const { name, email, password } = validated.data;
    const normalizedEmail = email.toLowerCase().trim();

    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      if (!existing.passwordHash) {
        const passwordHash = await bcrypt.hash(password, 10);
        const updated = await prisma.user.update({
          where: { id: existing.id },
          data: {
            passwordHash,
            name: name || existing.name,
          },
          select: {
            id: true,
            name: true,
            email: true,
            plan: true,
            analysisCount: true,
          },
        });
        return NextResponse.json(
          {
            message: "Password set successfully for your account! You can now sign in.",
            user: updated,
          },
          { status: 200 }
        );
      }

      return NextResponse.json(
        { error: "An academic account with this email address already exists. Please sign in." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email: normalizedEmail,
        passwordHash,
        plan: "FREE",
        analysisCount: 0, // exactly 5 free lifetime analyses
        subscriptionStatus: "INACTIVE",
      },
      select: {
        id: true,
        name: true,
        email: true,
        plan: true,
        analysisCount: true,
      },
    });

    return NextResponse.json(
      {
        message: "Academic account registered successfully! 5 free paper analyses unlocked.",
        user,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Registration error:", err);
    return NextResponse.json(
      { error: "An unexpected server error occurred during account creation." },
      { status: 500 }
    );
  }
}
