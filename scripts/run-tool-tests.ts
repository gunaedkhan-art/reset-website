#!/usr/bin/env npx tsx
/**
 * Runs lib tool unit tests without relying on shell glob expansion (Linux CI safe).
 * Run: npm run test:tools
 */
import { spawnSync } from "node:child_process";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");

const result = spawnSync(
  process.execPath,
  ["--import", "tsx", "--test", "lib/**/*.test.ts"],
  { stdio: "inherit", cwd: root },
);

if (result.error) {
  console.error(result.error);
  process.exit(1);
}

process.exit(result.status ?? 1);
