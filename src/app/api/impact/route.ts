import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { description, moduleId, hoursSaved } = await req.json();

    if (
      !description ||
      typeof description !== "string" ||
      description.trim().length === 0 ||
      description.trim().length > 200
    ) {
      return NextResponse.json(
        { error: "Description is required (max 200 characters)" },
        { status: 400 }
      );
    }

    if (!moduleId || typeof moduleId !== "string") {
      return NextResponse.json(
        { error: "Module is required" },
        { status: 400 }
      );
    }

    const hours = parseFloat(hoursSaved);
    if (isNaN(hours) || hours <= 0) {
      return NextResponse.json(
        { error: "Hours saved must be greater than 0" },
        { status: 400 }
      );
    }

    const impactLog = await prisma.impactLog.create({
      data: {
        userId: session.user.id,
        moduleId,
        description: description.trim(),
        hoursSaved: hours,
      },
      include: {
        module: { select: { title: true } },
      },
    });

    return NextResponse.json(impactLog);
  } catch (error) {
    console.error("[IMPACT_POST]", error);
    return NextResponse.json(
      { error: "Failed to create impact log" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const logs = await prisma.impactLog.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        module: { select: { title: true } },
      },
    });

    const totalHours = logs.reduce((sum, log) => sum + log.hoursSaved, 0);

    return NextResponse.json({
      logs,
      stats: {
        totalEntries: logs.length,
        totalHours: Math.round(totalHours * 10) / 10,
      },
    });
  } catch (error) {
    console.error("[IMPACT_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch impact logs" },
      { status: 500 }
    );
  }
}
