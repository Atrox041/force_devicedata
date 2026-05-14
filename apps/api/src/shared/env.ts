import { config } from "dotenv";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

export function loadEnv() {
  const envPath = resolve(process.cwd(), ".env");
  if (existsSync(envPath)) {
    config({ path: envPath });
  } else {
    config();
  }
}

