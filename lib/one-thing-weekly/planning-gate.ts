import type { OneThingWeeklyStore } from "./types";

export const WEEKLY_PLANNING_SCORE_COMPLETE_KEY =
  "reset-weekly-planning-score-complete-v1";
export const WEEKLY_TRACKER_PLANNING_GATE_DISMISSED_KEY =
  "reset-one-thing-weekly-planning-gate-dismissed-v1";

export const WEEKLY_PLANNING_SCORE_PATH = "/weekly-planning-score";

export function markWeeklyPlanningScoreComplete(): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(WEEKLY_PLANNING_SCORE_COMPLETE_KEY, "1");
}

export function hasCompletedWeeklyPlanningScore(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.localStorage.getItem(WEEKLY_PLANNING_SCORE_COMPLETE_KEY) === "1"
  );
}

export function dismissWeeklyTrackerPlanningGate(): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(WEEKLY_TRACKER_PLANNING_GATE_DISMISSED_KEY, "1");
}

export function isWeeklyTrackerPlanningGateDismissed(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.localStorage.getItem(WEEKLY_TRACKER_PLANNING_GATE_DISMISSED_KEY) ===
    "1"
  );
}

export interface WeeklyTrackerPlanningGateFlags {
  completedPlanningScore: boolean;
  dismissedGate: boolean;
}

/** Show the planning-score nudge on first tracker visit with no saved weeks. */
export function shouldShowWeeklyTrackerPlanningGate(
  store: OneThingWeeklyStore,
  flags: WeeklyTrackerPlanningGateFlags = {
    completedPlanningScore: hasCompletedWeeklyPlanningScore(),
    dismissedGate: isWeeklyTrackerPlanningGateDismissed(),
  },
): boolean {
  if (store.activePlan || store.archivedWeeks.length > 0) return false;
  if (flags.completedPlanningScore) return false;
  if (flags.dismissedGate) return false;
  return true;
}
