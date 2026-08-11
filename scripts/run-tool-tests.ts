#!/usr/bin/env npx tsx
/**
 * Runs lib tool unit tests without relying on shell glob expansion (Linux CI safe).
 * Run: npm run test:tools
 */
import { spawnSync } from "node:child_process";
import { readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");
const libRoot = join(root, "lib");
const testDirs = [
  "tool-engine",
  "investment",
  "savings-path",
  "one-thing-weekly",
  "rule-of-100",
  "trackers",
  "tools",
  "analytics",
];

function collectTestFiles(dir: string): string[] {
  const files: string[] = [];

  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectTestFiles(path));
      continue;
    }
    if (entry.name.endsWith(".test.ts")) {
      files.push(path);
    }
  }

  return files;
}

const files = testDirs.flatMap((dir) => collectTestFiles(join(libRoot, dir)));

if (files.length === 0) {
  console.error("No tool test files found.");
  process.exit(1);
}

const result = spawnSync(
  process.execPath,
  ["--import", "tsx", "--test", ...files],
  { stdio: "inherit", cwd: root },
);

process.exit(result.status ?? 1);
