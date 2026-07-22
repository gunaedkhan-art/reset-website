import { notificationCostCalculatorConfig } from "@/tools/config/notification-cost-calculator.config";
import { howToStopProcrastinatingConfig } from "@/tools/config/how-to-stop-procrastinating.config";
import { howToStopDoomscrollingConfig } from "@/tools/config/how-to-stop-doomscrolling.config";
import { howToStopCheckingYourPhoneConfig } from "@/tools/config/how-to-stop-checking-your-phone.config";
import { whyCantIFocusConfig } from "@/tools/config/why-cant-i-focus.config";
import { instagramTimeCalculatorConfig } from "@/tools/config/instagram-time-calculator.config";
import { procrastinationCostCalculatorConfig } from "@/tools/config/procrastination-cost-calculator.config";
import { screenTimeCostCalculatorConfig } from "@/tools/config/screen-time-cost-calculator.config";
import { meetingCostCalculatorConfig } from "@/tools/config/meeting-cost-calculator.config";
import { contextSwitchCostCalculatorConfig } from "@/tools/config/context-switch-cost-calculator.config";
import { socialMediaTimeCalculatorConfig } from "@/tools/config/social-media-time-calculator.config";
import { whyDoIProcrastinateConfig } from "@/tools/config/why-do-i-procrastinate.config";
import { howToFocusAtWorkConfig } from "@/tools/config/how-to-focus-at-work.config";
import { weeklyPlanningScoreConfig } from "@/tools/config/weekly-planning-score.config";
import type { ToolConfig } from "../schema/tool-config";
import { parseToolConfig } from "../schema/tool-config";

const rawConfigs = [
  notificationCostCalculatorConfig,
  howToStopProcrastinatingConfig,
  howToStopDoomscrollingConfig,
  howToStopCheckingYourPhoneConfig,
  whyCantIFocusConfig,
  instagramTimeCalculatorConfig,
  procrastinationCostCalculatorConfig,
  screenTimeCostCalculatorConfig,
  meetingCostCalculatorConfig,
  contextSwitchCostCalculatorConfig,
  socialMediaTimeCalculatorConfig,
  whyDoIProcrastinateConfig,
  howToFocusAtWorkConfig,
  weeklyPlanningScoreConfig,
] as const;

export const toolConfigManifest: ToolConfig[] = rawConfigs.map((config) =>
  parseToolConfig(config),
);

export const toolConfigBySlug: Record<string, ToolConfig> = Object.fromEntries(
  toolConfigManifest
    .filter((c) => c.status === "published")
    .map((c) => [c.slug, c]),
);

export const toolConfigById: Record<string, ToolConfig> = Object.fromEntries(
  toolConfigManifest.map((c) => [c.id, c]),
);

export function getConfigBySlug(slug: string): ToolConfig | undefined {
  return toolConfigBySlug[slug];
}

export function getAllConfigSlugs(): string[] {
  return Object.keys(toolConfigBySlug);
}

/** URL segment from canonical path, e.g. "/how-to-stop-procrastinating" → "how-to-stop-procrastinating" */
export function getToolUrlSlug(config: ToolConfig): string {
  return config.seo.canonicalPath.replace(/^\//, "");
}

export function getAllToolUrlSlugs(): string[] {
  return Object.values(toolConfigBySlug).map(getToolUrlSlug);
}

export function getConfigByUrlSlug(urlSlug: string): ToolConfig | undefined {
  const canonicalPath = `/${urlSlug}`;
  return toolConfigManifest.find(
    (config) =>
      config.status === "published" &&
      (config.seo.canonicalPath === canonicalPath || config.slug === urlSlug),
  );
}

export function configToMetadata(config: ToolConfig) {
  return {
    slug: config.slug,
    title: config.seo.title,
    description: config.seo.metaDescription,
    category: config.taxonomy.category,
    keywords: [config.seo.primaryKeyword, ...config.seo.secondaryKeywords],
    featured: config.taxonomy.clusterRole === "pillar",
    canonicalPath: config.seo.canonicalPath,
    cluster: config.taxonomy.cluster,
  };
}
