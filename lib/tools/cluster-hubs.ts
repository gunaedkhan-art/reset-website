import type { ClusterThemeId } from "./cluster-themes";

export interface ToolClusterHub {
  slug: string;
  name: string;
  description: string;
  themeId: ClusterThemeId;
  /** Config `taxonomy.cluster` values included on this hub. */
  clusters: string[];
  pillarSlug: string;
  metaDescription: string;
}

/** SEO cluster hub pages at `/tools/[hub-slug]`. */
export const toolClusterHubs: ToolClusterHub[] = [
  {
    slug: "deep-work",
    name: "Deep Work Tools",
    description:
      "Plan protected focus blocks, classify deep vs shallow work, and diagnose why depth keeps slipping away.",
    themeId: "deep-work",
    clusters: ["deep-work", "context-switch"],
    pillarSlug: "deep-or-shallow-work-quiz",
    metaDescription:
      "Free deep work tools — classify tasks, schedule focus blocks, and build a sustainable depth practice.",
  },
  {
    slug: "procrastination",
    name: "Procrastination Tools",
    description:
      "Find out why you stall, quantify the cost, and get a matched plan to start without shame spirals.",
    themeId: "procrastination",
    clusters: ["procrastination", "stop-procrastinating"],
    pillarSlug: "why-am-i-procrastinating",
    metaDescription:
      "Free procrastination diagnostics and calculators — understand your blocker and get a concrete next step.",
  },
  {
    slug: "phone-and-focus",
    name: "Phone & Focus Tools",
    description:
      "Measure notification and screen-time costs, break doomscrolling loops, and reclaim attention.",
    themeId: "phone-focus",
    clusters: [
      "phone-distraction",
      "phone-checking",
      "doomscrolling",
      "screen-time",
      "social-media-time",
      "phone-addiction",
      "focus-problems",
      "time-waste",
    ],
    pillarSlug: "notification-cost-calculator",
    metaDescription:
      "Free phone distraction and focus tools — calculate interruption costs and get practical recovery plans.",
  },
  {
    slug: "one-thing",
    name: "ONE Thing Tools",
    description:
      "Pick one priority, protect time for it, and cascade goals from someday down to today.",
    themeId: "one-thing",
    clusters: ["one-thing", "weekly-planning"],
    pillarSlug: "the-focusing-question",
    metaDescription:
      "Free ONE Thing planning tools based on Gary Keller's Focusing Question — find your lead domino.",
  },
  {
    slug: "money",
    name: "Money & Savings Tools",
    description:
      "Project investment growth, set savings targets, and track progress on a simple visual path.",
    themeId: "money",
    clusters: ["investment", "savings"],
    pillarSlug: "savings-path-tracker",
    metaDescription:
      "Free savings and investment calculators plus a visual savings path tracker — no spreadsheet required.",
  },
];

const hubBySlug = new Map(toolClusterHubs.map((hub) => [hub.slug, hub]));

export function getClusterHub(slug: string): ToolClusterHub | undefined {
  return hubBySlug.get(slug);
}

export function getAllClusterHubSlugs(): string[] {
  return toolClusterHubs.map((hub) => hub.slug);
}

export function isClusterHubSlug(slug: string): boolean {
  return hubBySlug.has(slug);
}
