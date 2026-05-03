import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Groq from "groq-sdk";

export const dynamic = "force-dynamic";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ moduleId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { moduleId } = await params;
    const selectedModule = await prisma.module.findUnique({
      where: { id: moduleId },
      select: {
        title: true,
        description: true,
        orderIndex: true,
      },
    });

    if (!selectedModule) {
      return NextResponse.json({ error: "Module not found" }, { status: 404 });
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You create concise learning takeaways for Be10X learners. Return exactly three bullets. Each bullet should be practical, workplace-focused, and under 18 words.",
        },
        {
          role: "user",
          content: `Module ${selectedModule.orderIndex}: ${selectedModule.title}\nDescription: ${selectedModule.description}`,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.4,
      max_tokens: 180,
    });

    const summary =
      completion.choices[0]?.message?.content?.trim() ||
      "- Apply the module concept to one real work task.\n- Save the result as proof of progress.\n- Repeat the workflow until it feels natural.";

    return NextResponse.json({ summary });
  } catch (error) {
    console.error("[MODULE_SUMMARY_POST]", error);
    return NextResponse.json(
      { error: "Failed to generate key takeaways" },
      { status: 500 }
    );
  }
}
