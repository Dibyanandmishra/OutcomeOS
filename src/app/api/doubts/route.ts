import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_PROMPT = `You are the Be10X AI Learning Assistant. You help learners who are enrolled in an AI tools workshop for working professionals. The workshop covers:
- ChatGPT and prompt engineering
- AI tools for writing and summarization
- AI automation
- AI for data analysis
- AI workflows for productivity

Answer clearly with real workplace examples. Keep answers under 150 words. Use simple language.

If a question is outside these topics, respond:
"This is outside the course scope. Please ask in your batch WhatsApp group."`;

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { question, moduleId } = await req.json();

    if (!question || typeof question !== "string" || question.trim().length === 0) {
      return NextResponse.json({ error: "Question is required" }, { status: 400 });
    }

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: question.trim() },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.6,
      max_tokens: 512,
    });

    const answer =
      chatCompletion.choices[0]?.message?.content?.trim() ||
      "Sorry, I could not generate a response. Please try again.";

    const doubt = await prisma.doubt.create({
      data: {
        userId: session.user.id,
        moduleId: moduleId || null,
        question: question.trim(),
        answer,
      },
    });

    return NextResponse.json({
      id: doubt.id,
      question: doubt.question,
      answer: doubt.answer,
      createdAt: doubt.createdAt,
    });
  } catch (error) {
    console.error("[DOUBTS_POST]", error);
    return NextResponse.json(
      { error: "Failed to process your question. Please try again." },
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

    const doubts = await prisma.doubt.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: {
        id: true,
        question: true,
        answer: true,
        createdAt: true,
        module: {
          select: { title: true },
        },
      },
    });

    return NextResponse.json(doubts);
  } catch (error) {
    console.error("[DOUBTS_GET]", error);
    return NextResponse.json({ error: "Failed to fetch doubts" }, { status: 500 });
  }
}
