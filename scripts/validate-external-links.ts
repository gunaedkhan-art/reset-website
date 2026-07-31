#!/usr/bin/env npx tsx
/**
 * Checks outbound citation URLs in authoritative-sources.ts.
 * Uses GET (some PDF hosts reject HEAD).
 * Run: npm run validate:links
 */
import { authoritativeSources } from "../lib/content/authoritative-sources";

async function main(): Promise<void> {
  let failed = 0;

  for (const [key, source] of Object.entries(authoritativeSources)) {
    try {
      const response = await fetch(source.href, {
        method: "GET",
        redirect: "follow",
        headers: { "User-Agent": "ResetLinkValidator/1.0" },
      });

      if (response.status >= 400) {
        console.error(`✖ ${key}: ${response.status} ${source.href}`);
        failed++;
      } else {
        console.log(`✔ ${key}: ${response.status} ${source.href}`);
      }
    } catch (error) {
      console.error(
        `✖ ${key}: ${error instanceof Error ? error.message : error} — ${source.href}`,
      );
      failed++;
    }
  }

  if (failed > 0) {
    console.error(`\n${failed} link(s) failed.`);
    process.exit(1);
  }

  console.log(`\nAll ${Object.keys(authoritativeSources).length} citation links OK.`);
}

main();
