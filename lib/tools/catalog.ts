import type { ToolCategory } from "@/types/tool";
import type { RelatedTool, ToolMetadata } from "@/types/tool";
import { getConfigBySlug } from "@/lib/tool-engine/compiler/manifest";
import {
  getAllToolSlugs,
  getToolMetadata,
} from "./registry";
import { getToolCanonicalPath } from "./tool-page";

export const toolCategories: ToolCategory[] = [
  {
    slug: "productivity",
    name: "Productivity",
    description: "Tools to streamline workflows and save time.",
  },
  {
    slug: "focus",
    name: "Focus",
    description: "Tools for deep work and attention management.",
  },
  {
    slug: "planning",
    name: "Planning",
    description: "Goal setting, scheduling, and project planning utilities.",
  },
  {
    slug: "calculators",
    name: "Calculators",
    description: "Quick calculators for everyday decisions.",
  },
];

/** Clusters that should cross-link for internal discovery */
const relatedClusterMap: Record<string, string[]> = {
  "phone-distraction": ["phone-checking", "doomscrolling", "screen-time", "focus-problems"],
  "phone-checking": ["phone-distraction", "doomscrolling", "focus-problems"],
  doomscrolling: ["phone-checking", "phone-distraction", "social-media-time", "screen-time"],
  "screen-time": ["doomscrolling", "social-media-time", "phone-distraction"],
  "social-media-time": ["doomscrolling", "screen-time"],
  procrastination: ["stop-procrastinating", "weekly-planning"],
  "stop-procrastinating": ["procrastination", "weekly-planning"],
  "focus-problems": ["phone-checking", "doomscrolling", "phone-distraction", "context-switch"],
  "meeting-cost": ["context-switch", "procrastination"],
  "context-switch": ["meeting-cost", "focus-problems", "phone-distraction"],
  "weekly-planning": ["stop-procrastinating", "procrastination", "getting-started"],
  "getting-started": ["weekly-planning", "stop-procrastinating", "overwhelm"],
  overwhelm: ["getting-started", "weekly-planning", "motivation"],
  motivation: ["overwhelm", "stop-procrastinating", "habits"],
  "time-waste": ["phone-addiction", "doomscrolling", "context-switch"],
  "phone-addiction": ["phone-checking", "phone-distraction", "time-waste"],
  habits: ["motivation", "stop-procrastinating", "weekly-planning"],
  "micro-time": ["getting-started", "doomscrolling", "micro-time"],
  homework: ["stop-procrastinating", "getting-started", "focus-problems"],
  "deep-work": ["focus-problems", "context-switch", "weekly-planning", "meeting-cost"],
  "one-thing": ["weekly-planning", "getting-started", "deep-work", "overwhelm"],
};

/** @deprecated Use getAllTools() instead */
export const toolsRegistry: ToolMetadata[] = getAllTools();

export function getAllTools(): ToolMetadata[] {
  return getAllToolSlugs()
    .map((slug) => getToolMetadata(slug))
    .filter((tool): tool is ToolMetadata => tool !== undefined);
}

export function getToolsByCategory(categorySlug: string): ToolMetadata[] {
  return getAllTools().filter((tool) => tool.category === categorySlug);
}

export function searchTools(
  tools: ToolMetadata[],
  query: string,
): ToolMetadata[] {
  const q = query.trim().toLowerCase();
  if (!q) return tools;

  return tools.filter((tool) => {
    const haystack = [
      tool.title,
      tool.description,
      tool.category,
      tool.cluster ?? "",
      ...(tool.keywords ?? []),
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(q);
  });
}

export function getFeaturedTools(limit = 6): ToolMetadata[] {
  return getAllTools()
    .filter((tool) => tool.featured)
    .slice(0, limit);
}

function toRelatedTool(tool: ToolMetadata): RelatedTool {
  return {
    slug: tool.slug,
    title: tool.title,
    description: tool.description,
    category: tool.category,
    href: tool.canonicalPath ?? getToolCanonicalPath(tool.slug),
  };
}

export function getRelatedTools(
  currentSlug: string,
  limit = 4,
): RelatedTool[] {
  const current = getToolMetadata(currentSlug);
  const currentConfig = getConfigBySlug(currentSlug);
  const cluster = currentConfig?.taxonomy.cluster ?? current?.cluster;

  const others = getAllTools().filter((tool) => tool.slug !== currentSlug);

  const sameCluster = cluster
    ? others.filter(
        (tool) => getConfigBySlug(tool.slug)?.taxonomy.cluster === cluster,
      )
    : [];

  const relatedClusterSlugs = cluster ? (relatedClusterMap[cluster] ?? []) : [];
  const relatedCluster = others.filter((tool) => {
    const toolCluster = getConfigBySlug(tool.slug)?.taxonomy.cluster;
    return (
      toolCluster &&
      relatedClusterSlugs.includes(toolCluster) &&
      !sameCluster.some((t) => t.slug === tool.slug)
    );
  });

  const sameCategory = others.filter(
    (tool) =>
      tool.category === current?.category &&
      !sameCluster.some((t) => t.slug === tool.slug) &&
      !relatedCluster.some((t) => t.slug === tool.slug),
  );

  return [...sameCluster, ...relatedCluster, ...sameCategory]
    .slice(0, limit)
    .map(toRelatedTool);
}

export function getCategoryBySlug(
  slug: string,
): ToolCategory | undefined {
  return toolCategories.find((cat) => cat.slug === slug);
}
