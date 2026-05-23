import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

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

function buildModuleContext(module: {
  title: string;
  description: string;
  orderIndex: number;
} | null) {
  if (!module) return "";

  return `\n\nCurrent learner module context:\nModule ${module.orderIndex}: ${module.title}\nModule description: ${module.description}\n\nUse this context to answer specifically for the current module. If the question is ambiguous, connect the answer to this module.`;
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { question, moduleId, conversationId } = await req.json();

    if (!question || typeof question !== "string" || question.trim().length === 0) {
      return NextResponse.json({ error: "Question is required" }, { status: 400 });
    }

    const selectedModule =
      typeof moduleId === "string"
        ? await prisma.module.findUnique({
            where: { id: moduleId },
            select: {
              title: true,
              description: true,
              orderIndex: true,
            },
          })
        : null;

    let activeConversationId = conversationId;
    let chatHistory: { role: "user" | "assistant"; content: string }[] = [];

    if (activeConversationId) {
      // Validate conversation ownership
      const existingConv = await prisma.conversation.findUnique({
        where: {
          id: activeConversationId,
          userId: session.user.id,
        },
      });

      if (!existingConv) {
        return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
      }

      // Fetch message history for LLM context
      const previousDoubts = await prisma.doubt.findMany({
        where: { conversationId: activeConversationId },
        orderBy: { createdAt: "asc" },
        select: {
          question: true,
          answer: true,
        },
      });

      chatHistory = previousDoubts.flatMap((d) => [
        { role: "user" as const, content: d.question },
        { role: "assistant" as const, content: d.answer },
      ]);
    } else {
      // Create new conversation
      const title =
        question.trim().length > 40
          ? question.trim().substring(0, 40) + "..."
          : question.trim();

      const newConversation = await prisma.conversation.create({
        data: {
          userId: session.user.id,
          title,
        },
      });
      activeConversationId = newConversation.id;
    }

    const messages = [
      {
        role: "system" as const,
        content: `${SYSTEM_PROMPT}${buildModuleContext(selectedModule)}`,
      },
      ...chatHistory,
      { role: "user" as const, content: question.trim() },
    ];

    const chatStream = await groq.chat.completions.create({
      messages,
      model: "llama-3.3-70b-versatile",
      temperature: 0.6,
      max_tokens: 512,
      stream: true,
    });

    const encoder = new TextEncoder();
    const trimmedQuestion = question.trim();

    const stream = new ReadableStream({
      async start(controller) {
        let answer = "";

        try {
          for await (const chunk of chatStream) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (!content) continue;

            answer += content;
            controller.enqueue(encoder.encode(content));
          }

          const savedAnswer =
            answer.trim() ||
            "Sorry, I could not generate a response. Please try again.";

          if (!answer.trim()) {
            controller.enqueue(encoder.encode(savedAnswer));
          }

          await prisma.doubt.create({
            data: {
              userId: session.user.id,
              moduleId: moduleId || null,
              question: trimmedQuestion,
              answer: savedAnswer,
              conversationId: activeConversationId,
            },
          });

          // Update conversation updatedAt timestamp to pop to the top of the list
          await prisma.conversation.update({
            where: { id: activeConversationId },
            data: { updatedAt: new Date() },
          });
        } catch (error) {
          console.error("[DOUBTS_STREAM]", error);
          if (!answer.trim()) {
            controller.enqueue(
              encoder.encode("Failed to process your question. Please try again.")
            );
          }
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "X-Content-Type-Options": "nosniff",
        "Access-Control-Expose-Headers": "X-Conversation-Id",
        "X-Conversation-Id": activeConversationId,
      },
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
