import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  console.log("params = ", params);

  if (params.get("id") === null) {
    return NextResponse.json({
      message: "id field is required",
      params: params,
    });
  }

  const id = params.get("id")!;

  console.log("id = ", id);

  try {
    const plans = await prisma.plan.findMany({
      where: {
        id: parseInt(id),
      },
      select: {
        id: true,
        startDate: true,
        endDate: true,
        createdAt: true,
        lastPlanVersionId: true,
      },
    });

    console.log("plans = ", plans);
    return NextResponse.json({
      message: "No Plans found",
      plans: plans,
      status: 404,
    });
  } catch (err: any) {
    console.log("err = ", err);
    return NextResponse.json({ message: err, params: params });
  }
}
