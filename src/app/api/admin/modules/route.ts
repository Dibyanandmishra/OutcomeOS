import { NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
      session: null,
    };
  }

  if (session.user.role !== Role.ADMIN) {
    return {
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
      session: null,
    };
  }

  return { error: null, session };
}

function validateModulePayload(body: unknown) {
  if (!body || typeof body !== "object") {
    return { error: "Invalid payload" };
  }

  const data = body as {
    title?: unknown;
    description?: unknown;
    orderIndex?: unknown;
  };
  const title = typeof data.title === "string" ? data.title.trim() : "";
  const description =
    typeof data.description === "string" ? data.description.trim() : "";
  const orderIndex =
    typeof data.orderIndex === "number"
      ? data.orderIndex
      : Number(data.orderIndex);

  if (!title) {
    return { error: "Title is required" };
  }

  if (title.length > 100) {
    return { error: "Title must be 100 characters or less" };
  }

  if (!description) {
    return { error: "Description is required" };
  }

  if (description.length > 300) {
    return { error: "Description must be 300 characters or less" };
  }

  if (!Number.isInteger(orderIndex) || orderIndex < 1) {
    return { error: "Order must be a positive whole number" };
  }

  return {
    data: {
      title,
      description,
      orderIndex,
    },
  };
}

export async function POST(req: Request) {
  try {
    const { error } = await requireAdmin();
    if (error) return error;

    const validation = validateModulePayload(await req.json());
    if (validation.error || !validation.data) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const createdModule = await prisma.module.create({
      data: validation.data,
    });

    return NextResponse.json(createdModule, { status: 201 });
  } catch (error) {
    console.error("[ADMIN_MODULES_POST]", error);
    return NextResponse.json(
      { error: "Failed to create module" },
      { status: 500 }
    );
  }
}
