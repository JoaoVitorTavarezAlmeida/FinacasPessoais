import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const envPath = path.join(rootDir, ".env");
const envExamplePath = path.join(rootDir, ".env.example");

if (fs.existsSync(envPath)) {
  console.log(".env ja existe.");
  process.exit(0);
}

if (!fs.existsSync(envExamplePath)) {
  console.error("Arquivo .env.example nao encontrado.");
  process.exit(1);
}

fs.copyFileSync(envExamplePath, envPath);
console.log(".env criado a partir de .env.example.");
