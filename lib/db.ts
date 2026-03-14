import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL is not configured.");
  }

  const adapter = new PrismaPg({ connectionString });

  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

declare global {
  var __prisma__: PrismaClient | undefined;
}

export function getDb() {
  const client = globalThis.__prisma__ ?? createPrismaClient();

  if (process.env.NODE_ENV !== "production") {
    globalThis.__prisma__ = client;
  }

  return client;
}
