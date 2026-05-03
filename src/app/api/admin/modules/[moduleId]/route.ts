import { NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== Role.ADMIN) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return null;
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

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ moduleId: string }> }
) {
  try {
    const authError = await requireAdmin();
    if (authError) return authError;

    const { moduleId } = await params;
    const validation = validateModulePayload(await req.json());

    if (validation.error || !validation.data) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const updatedModule = await prisma.module.update({
      where: { id: moduleId },
      data: validation.data,
    });

    return NextResponse.json(updatedModule);
  } catch (error) {
    console.error("[ADMIN_MODULES_PATCH]", error);
    return NextResponse.json(
      { error: "Failed to update module" },
      { status: 500 }
    );
  }
}
