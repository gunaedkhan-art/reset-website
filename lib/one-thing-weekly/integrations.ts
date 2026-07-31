import type { DecisionTreeState } from "@/lib/tool-engine/modes/decision-tree";

const GOAL_SETTING_WEEKLY_RESULTS = new Set([
  "weekly",
  "daily",
  "connected",
]);

const FOCUSING_WEEKLY_RESULTS = new Set(["work_week"]);

/** Whether to show the weekly check-in CTA after a decision-tree result. */
export function shouldOfferWeeklyTracker(
  toolSlug: string,
  state: DecisionTreeState,
): boolean {
  if (!state.complete || !state.resultTemplateId) return false;

  if (toolSlug === "the-focusing-question") {
    return (
      state.answers.q_horizon === "week" ||
      FOCUSING_WEEKLY_RESULTS.has(state.resultTemplateId)
    );
  }

  if (toolSlug === "goal-setting-to-the-now") {
    return (
      state.answers.q_break === "week" ||
      state.answers.q_break === "today" ||
      GOAL_SETTING_WEEKLY_RESULTS.has(state.resultTemplateId)
    );
  }

  return false;
}
