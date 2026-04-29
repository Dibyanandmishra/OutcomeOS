import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Status } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { moduleId, status } = await req.json();

    if (!moduleId || !Object.values(Status).includes(status)) {
      return new NextResponse("Invalid payload", { status: 400 });
    }

    const progress = await prisma.progress.upsert({
      where: {
        userId_moduleId: {
          userId: session.user.id,
          moduleId,
        },
      },
      update: {
        status,
      },
      create: {
        userId: session.user.id,
        moduleId,
        status,
      },
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error("[PROGRESS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
