import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.module.createMany({
    data: [
      {
        title: "ChatGPT Basics",
        description: "Learn how to use ChatGPT effectively for daily tasks",
        orderIndex: 1,
      },
      {
        title: "Prompt Engineering",
        description: "Write better prompts for better AI results",
        orderIndex: 2,
      },
      {
        title: "AI for Writing",
        description: "Use AI to draft emails, reports, and documents",
        orderIndex: 3,
      },
      {
        title: "AI Automation",
        description: "Automate repetitive tasks using AI tools",
        orderIndex: 4,
      },
      {
        title: "AI for Data Analysis",
        description: "Analyze data using AI tools and spreadsheets",
        orderIndex: 5,
      },
      {
        title: "AI Workflows",
        description: "Build workflows for productivity using AI",
        orderIndex: 6,
      },
    ],
  });

  console.log("Modules seeded");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });