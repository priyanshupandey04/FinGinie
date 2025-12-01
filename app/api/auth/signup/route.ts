// app/api/auth/signup/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const SignUpSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  email: z.string().email(),
  password: z.string().min(6).max(200),
  image: z.string().url().optional(),
  phone: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = SignUpSchema.parse(body);

    console.log("parsed body = ", parsed);

    // check if user already exists
    const existing = await prisma.user.findUnique({
      where: { email: parsed.email },
    });
    if (existing) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    // hash password
    const hashed = await bcrypt.hash(parsed.password, 10);
    console.log("hashed = ", hashed);

    const user = await prisma.user.create({
      data: {
        name: parsed.name,
        email: parsed.email,
        password: hashed,
        image: parsed.image,
        phone: parsed.phone === undefined ? null : parsed.phone,
      },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        createdAt: true,
        phone: true,
      },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (err: any) {
    if (err?.name === "ZodError") {
      return NextResponse.json(
        { error: "Invalid input", details: err.errors },
        { status: 422 }
      );
    }
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
