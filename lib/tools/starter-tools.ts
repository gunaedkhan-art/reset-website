import type { ToolMetadata } from "@/types/tool";
import { getToolMetadata } from "./registry";

export interface RecommendedStarterTool {
  slug: string;
  reason: string;
}

/** Curated entry points — one strong tool per common job, not SEO duplicates. */
export const recommendedStarterTools: RecommendedStarterTool[] = [
  {
    slug: "help-me-focus-now",
    reason: "Stuck right now? Get one concrete focus step in under a minute.",
  },
  {
    slug: "give-me-one-small-task",
    reason: "Overwhelmed? One tiny task to break the freeze and start moving.",
  },
  {
    slug: "the-focusing-question",
    reason: "Clarify the ONE Thing that makes everything else easier or unnecessary.",
  },
  {
    slug: "whats-my-lead-domino",
    reason: "Find the first domino — the one action that unlocks the rest.",
  },
  {
    slug: "deep-or-shallow-work-quiz",
    reason: "Classify any task: protect it, batch it, delegate it, or drop it.",
  },
  {
    slug: "why-am-i-procrastinating",
    reason: "Diagnose why you're stalling and get a matched action plan.",
  },
  {
    slug: "notification-cost-calculator",
    reason: "See how much focus time phone interruptions actually cost you.",
  },
  {
    slug: "meeting-cost-calculator",
    reason: "Quantify the time and money your calendar is eating each year.",
  },
  {
    slug: "savings-path-tracker",
    reason: "Track savings on one simple line — no spreadsheet required.",
  },
  {
    slug: "investment-growth-calculator",
    reason: "Project how contributions and growth compound over time.",
  },
];

export function getRecommendedStarterTools(): (ToolMetadata & {
  reason: string;
})[] {
  return recommendedStarterTools.flatMap((entry) => {
    const tool = getToolMetadata(entry.slug);
    if (!tool) return [];
    return [{ ...tool, reason: entry.reason }];
  });
}
