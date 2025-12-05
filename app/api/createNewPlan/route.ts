import { getServerSession, Session } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "../auth/[...nextauth]/authStuff";
import { prisma } from "@/lib/prisma";

const planSchema = z.object({
  monthlyInvestment: z.coerce
    .number()
    .refine((n) => !Number.isNaN(n), { message: "Required" })
    .min(500, "Min investment is 500")
    .max(100000, "Max investment is 1,00,000"),
  period: z.coerce
    .number()
    .refine((n) => !Number.isNaN(n), { message: "Required" })
    .min(1, "Min 1 year")
    .max(50, "Max 50 years"),
  riskScore: z.coerce
    .number()
    .min(1, { message: "Min risk score is 1" })
    .max(10, { message: "Max risk score is 10" }),
});

export async function POST(req: Request) {
  const body = await req.json();
  console.log("body = ", body);

  const session: Session | null = await getServerSession(authOptions as any);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

  const paresedData = await planSchema.safeParseAsync(body);

  if (paresedData.success === false) {
    return NextResponse.json(
      { message: paresedData.error.message },
      { status: 422 }
    );
  }
  console.log("paresedData = ", paresedData.data);

  const startDate = new Date();
  const endDate = new Date(
    new Date().getTime() + paresedData.data.period * 365 * 24 * 60 * 60 * 1000
  );
  console.log("startdate ", startDate, " endDate = ", endDate);
  // 1. CREATE PLAN FIRST
  const plan = await prisma.plan.create({
    data: {
      startDate: startDate,
      endDate: endDate,
      user: { connect: { id: Number(session?.user?.id) } },
    },
  });

  // 2. CREATE PLAN VERSION AND LINK IT
  const planVersion = await prisma.planVersion.create({
    data: {
      monthlyInvestment: paresedData.data.monthlyInvestment,
      riskScore: paresedData.data.riskScore,
      startDate,
      endDate,
      plan: { connect: { id: plan.id } }, // REQUIRED
    },
  });

  // 3. UPDATE LAST VERSION ID
  await prisma.plan.update({
    where: { id: plan.id },
    data: {
      lastPlanVersionId: planVersion.id,
    },
  });

  return NextResponse.json({ message: "Plan Created" });
}
