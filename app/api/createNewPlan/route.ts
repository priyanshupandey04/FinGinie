import { getServerSession, Session } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { authOptions } from "../auth/[...nextauth]/authStuff";

// 1. Expanded Zod Schema to match your Frontend Form
const planSchema = z.object({
  monthlyInvestment: z.coerce
    .number()
    .min(500, "Min investment is 500")
    .max(100000, "Max investment is 1,00,000"),
  period: z.coerce.number().min(1, "Min 1 year").max(50, "Max 50 years"),
  riskScore: z.coerce.number().min(1).max(10),
  age: z.coerce.number().optional(),
  annualIncome: z.coerce.number().optional(),
  goalDescription: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    // 2. Check Session
    const session: Session | null = await getServerSession(authOptions as any);

    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 3. Parse & Validate Body
    const body = await req.json();
    const parsed = await planSchema.safeParseAsync(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Invalid Input", errors: parsed.error.format() },
        { status: 422 }
      );
    }

    console.log("parsed data = ", parsed.data);
    const {
      monthlyInvestment,
      period,
      riskScore,
      age,
      annualIncome,
      goalDescription,
    } = parsed.data;

    // 4. Calculate Dates (Accurately)
    const startDate = new Date();
    const endDate = new Date();
    endDate.setFullYear(startDate.getFullYear() + period);

    // 5. Database Transaction (ACID Compliant)
    // We use a transaction so if one part fails, everything rolls back.
    const result = await prisma.$transaction(async (tx) => {
      // A. Create Plan AND the First Version simultaneously
      const newPlan = await tx.plan.create({
        data: {
          userId: Number(session.user.id), // Ensure ID is a number
          label: goalDescription || "My Investment Plan",
          startDate: startDate,
          endDate: endDate,
          // Nested write: Create the version at the same time
          versions: {
            create: {
              monthlyInvestment,
              riskScore,
              startDate,
              endDate, // First version runs for full duration
              age,
              income: annualIncome,
              notes: "Initial Plan",
            },
          },
        },
        include: {
          versions: true, // Return versions so we can grab the ID
        },
      });

      // B. Get the ID of the version we just created
      const firstVersionId = newPlan.versions[0].id;

      // C. Update the Plan to point to this latest version
      const updatedPlan = await tx.plan.update({
        where: { id: newPlan.id },
        data: {
          lastPlanVersionId: firstVersionId,
        },
      });

      console.log("updated plan = ", updatedPlan);
      return updatedPlan;
    });

    return NextResponse.json({
      success: true,
      message: "Plan Created Successfully",
      planId: result.id,
    });
  } catch (error) {
    console.error("CREATE PLAN ERROR:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
