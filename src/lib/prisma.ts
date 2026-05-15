import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

console.log("Initializing Prisma Client...");
if (!process.env.DATABASE_URL) {
  console.error("CRITICAL: DATABASE_URL is not defined in environment variables!");
} else {
  console.log("DATABASE_URL is defined (prefix):", process.env.DATABASE_URL.substring(0, 15) + "...");
}

export const prisma =
  globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;