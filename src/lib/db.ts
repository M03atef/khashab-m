import { PrismaClient } from "@prisma/client";

// Local/mock fallback when DATABASE_URL is unset (dev / preview without secrets)
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = "file:./db/custom.db";
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
