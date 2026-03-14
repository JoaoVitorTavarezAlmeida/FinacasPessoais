import * as fs from "node:fs";
import * as path from "node:path";

import { defineConfig } from "prisma/config";

function readLocalDatabaseUrl() {
  const envPath = path.join(process.cwd(), ".env");

  if (!fs.existsSync(envPath)) {
    return process.env.DATABASE_URL ?? "";
  }

  const envFile = fs.readFileSync(envPath, "utf8");
  const line = envFile
    .split("\n")
    .find((entry) => entry.trim().startsWith("DATABASE_URL="));

  if (!line) {
    return process.env.DATABASE_URL ?? "";
  }

  const [, rawValue = ""] = line.split("=", 2);
  return rawValue.trim().replace(/^"/, "").replace(/"$/, "");
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL ?? readLocalDatabaseUrl(),
  },
});
