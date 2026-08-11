#!/usr/bin/env npx tsx
/**
 * Runs lib tool unit tests without relying on shell glob expansion (Linux CI safe).
 * Run: npm run test:tools
 */
import { once } from "node:events";
import { readdirSync } from "node:fs";
import { join, relative } from "node:path";
import { run } from "node:test";
import { spec } from "node:test/reporters";
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

const files = testDirs
  .flatMap((dir) => collectTestFiles(join(libRoot, dir)))
  .map((file) => relative(root, file).replace(/\\/g, "/"));

if (files.length === 0) {
  console.error("No tool test files found.");
  process.exit(1);
}

async function main(): Promise<void> {
  let failed = false;
  const stream = run({ files });

  stream.on("test:fail", () => {
    failed = true;
  });

  stream.compose(spec).pipe(process.stdout);
  await once(stream, "end");
  process.exit(failed ? 1 : 0);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
