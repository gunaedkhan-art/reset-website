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
import { iCantFocusConfig } from "@/tools/config/i-cant-focus.config";
import { imOverwhelmedConfig } from "@/tools/config/im-overwhelmed.config";
import { iDontKnowWhereToStartConfig } from "@/tools/config/i-dont-know-where-to-start.config";
import { iKeepProcrastinatingConfig } from "@/tools/config/i-keep-procrastinating.config";
import { iDontFeelMotivatedConfig } from "@/tools/config/i-dont-feel-motivated.config";
import { iCantStopScrollingConfig } from "@/tools/config/i-cant-stop-scrolling.config";
import { iDontKnowMyPrioritiesConfig } from "@/tools/config/i-dont-know-my-priorities.config";
import { iWasteTooMuchTimeConfig } from "@/tools/config/i-waste-too-much-time.config";
import { amIAddictedToMyPhoneConfig } from "@/tools/config/am-i-addicted-to-my-phone.config";
import { iCantStickToHabitsConfig } from "@/tools/config/i-cant-stick-to-habits.config";
import { whatShouldIDoInsteadOfScrollingConfig } from "@/tools/config/what-should-i-do-instead-of-scrolling.config";
import { whatShouldIDoFor15MinutesConfig } from "@/tools/config/what-should-i-do-for-15-minutes.config";
import { helpMeStartMyHomeworkConfig } from "@/tools/config/help-me-start-my-homework.config";
import { helpMeStopProcrastinatingConfig } from "@/tools/config/help-me-stop-procrastinating.config";
import { giveMeOneSmallTaskConfig } from "@/tools/config/give-me-one-small-task.config";
import { helpMeFocusNowConfig } from "@/tools/config/help-me-focus-now.config";
import { whyAmIProcrastinatingConfig } from "@/tools/config/why-am-i-procrastinating.config";
import { iFeelOverwhelmedWithWorkConfig } from "@/tools/config/i-feel-overwhelmed-with-work.config";
import { iCantConcentrateTodayConfig } from "@/tools/config/i-cant-concentrate-today.config";
import { howToDoDeepWorkConfig } from "@/tools/config/how-to-do-deep-work.config";
import { deepWorkScheduleQuizConfig } from "@/tools/config/deep-work-schedule-quiz.config";
import { shallowWorkAuditConfig } from "@/tools/config/shallow-work-audit.config";
import { deepOrShallowWorkQuizConfig } from "@/tools/config/deep-or-shallow-work-quiz.config";
import { shutdownRitualBuilderConfig } from "@/tools/config/shutdown-ritual-builder.config";
import { whyDeepWorkConfig } from "@/tools/config/why-deep-work.config";
import { whyDeepWorkFeelsImpossibleToStartConfig } from "@/tools/config/why-deep-work-feels-impossible-to-start.config";
import { whatAreDeepWorkBlocksConfig } from "@/tools/config/what-are-deep-work-blocks.config";
import { whenToDoDeepWorkConfig } from "@/tools/config/when-to-do-deep-work.config";
import { theFocusingQuestionConfig } from "@/tools/config/the-focusing-question.config";
import { goalSettingToTheNowConfig } from "@/tools/config/goal-setting-to-the-now.config";
import { fourThievesProductivityQuizConfig } from "@/tools/config/four-thieves-productivity-quiz.config";
import { protectYourOneThingTimeBlockConfig } from "@/tools/config/protect-your-one-thing-time-block.config";
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
  iCantFocusConfig,
  imOverwhelmedConfig,
  iDontKnowWhereToStartConfig,
  iKeepProcrastinatingConfig,
  iDontFeelMotivatedConfig,
  iCantStopScrollingConfig,
  iDontKnowMyPrioritiesConfig,
  iWasteTooMuchTimeConfig,
  amIAddictedToMyPhoneConfig,
  iCantStickToHabitsConfig,
  whatShouldIDoInsteadOfScrollingConfig,
  whatShouldIDoFor15MinutesConfig,
  helpMeStartMyHomeworkConfig,
  helpMeStopProcrastinatingConfig,
  giveMeOneSmallTaskConfig,
  helpMeFocusNowConfig,
  whyAmIProcrastinatingConfig,
  iFeelOverwhelmedWithWorkConfig,
  iCantConcentrateTodayConfig,
  howToDoDeepWorkConfig,
  deepWorkScheduleQuizConfig,
  shallowWorkAuditConfig,
  deepOrShallowWorkQuizConfig,
  shutdownRitualBuilderConfig,
  whyDeepWorkConfig,
  whyDeepWorkFeelsImpossibleToStartConfig,
  whatAreDeepWorkBlocksConfig,
  whenToDoDeepWorkConfig,
  theFocusingQuestionConfig,
  goalSettingToTheNowConfig,
  fourThievesProductivityQuizConfig,
  protectYourOneThingTimeBlockConfig,
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
