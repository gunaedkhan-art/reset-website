#!/usr/bin/env npx tsx
/**
 * Validates all tool configs in the manifest.
 * Run: npm run validate:tools
 */
import { toolConfigManifest } from "../lib/tool-engine/compiler/manifest";
import { validateAllConfigs } from "../lib/tool-engine/compiler/validate";

const result = validateAllConfigs(toolConfigManifest);

if (result.errors.length > 0) {
  console.error(`❌ ${result.errors.length} invalid tool config(s):\n`);
  for (const error of result.errors) {
    console.error(`  [${error.index}] ${error.message}`);
  }
  process.exit(1);
}

console.log(`✅ ${result.valid} tool config(s) valid`);
