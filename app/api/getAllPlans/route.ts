import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const id = params.get("id");

  if (!id) {
    return NextResponse.json({ message: "ID is required" }, { status: 400 });
  }
  console.log("id = ", id+" types = ", typeof(parseInt(id)));
  try {
    // Fetch the plan
    const plans = await prisma.plan.findMany({
      where: {
        userId: parseInt(id), // This fetches a specific plan by ID
      },
      select: {
        id: true,
        label: true, // Added label so it shows in header
        startDate: true,
        endDate: true,
        createdAt: true,
        lastPlanVersionId: true,
        versions: {
          orderBy: { createdAt: 'asc' }, // Sort versions correctly
          select: {
            id: true,
            monthlyInvestment: true,
            riskScore: true,
            startDate: true,
            endDate: true,
            age: true,
            income: true,
            notes: true,
          },
        },
      },
    });

    console.log("plans = ", plans);

    const allPlans = await prisma.plan.findMany();
    console.log("allPlans = ", allPlans);

    // ✅ CHECK IF PLANS EXIST BEFORE RETURNING
    if (!plans || plans.length === 0) {
      return NextResponse.json({ 
        message: "No Plan found", 
        plans: [] 
      }, { status: 404 });
    }

    // ✅ SUCCESS RESPONSE
    return NextResponse.json({
      message: "Success",
      plans: plans,
    }, { status: 200 });

  } catch (err: any) {
    console.error("API Error:", err);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}