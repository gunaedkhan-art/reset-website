import { getTrackStatus } from "@/lib/savings-path/calculate";
import { formatCurrency } from "@/lib/savings-path/format";
import type { SavingsPathPlan } from "@/lib/savings-path/types";
import {
  buildWeekSummary,
  buildWeekVisual,
  hasPendingTodayCheckIn,
} from "@/lib/one-thing-weekly/calculate";
import { formatWeekRange } from "@/lib/one-thing-weekly/format";
import type { WeekDayVisual } from "@/lib/one-thing-weekly/calculate";
import type { OneThingWeeklyStore } from "@/lib/one-thing-weekly/types";

export const SAVINGS_PATH_TRACKER_PATH = "/savings-path-tracker";
export const ONE_THING_WEEKLY_TRACKER_PATH = "/one-thing-weekly-check-in";

export interface SavingsPathHomeWidget {
  kind: "savings-path";
  href: string;
  targetLabel: string;
  balanceLabel: string;
  statusLabel: string;
  onTrack: boolean;
}

export interface OneThingWeeklyHomeWidget {
  kind: "one-thing-weekly";
  href: string;
  oneThing: string;
  weekLabel: string;
  scorePercent: number | null;
  yesCount: number;
  eligibleDays: number;
  pendingToday: boolean;
  weekVisual: WeekDayVisual[];
}

export interface HomeTrackerWidgets {
  savingsPath: SavingsPathHomeWidget | null;
  oneThingWeekly: OneThingWeeklyHomeWidget | null;
}

export function buildSavingsPathHomeWidget(
  plan: SavingsPathPlan | null,
  asOfDate?: string,
): SavingsPathHomeWidget | null {
  if (!plan) return null;

  const status = getTrackStatus(plan.goal, plan.checkIns, asOfDate);
  const { goal } = plan;

  return {
    kind: "savings-path",
    href: SAVINGS_PATH_TRACKER_PATH,
    targetLabel: `Goal ${formatCurrency(goal.targetAmount, goal.currency)}`,
    balanceLabel: formatCurrency(status.actualAmount, goal.currency, {
      precise: true,
    }),
    statusLabel: status.onTrack
      ? "On track"
      : `Behind by ${formatCurrency(Math.abs(status.gap), goal.currency)}`,
    onTrack: status.onTrack,
  };
}

export function buildOneThingWeeklyHomeWidget(
  store: OneThingWeeklyStore | null,
  asOfDate: string,
): OneThingWeeklyHomeWidget | null {
  if (!store?.activePlan) return null;

  const plan = store.activePlan;
  const summary = buildWeekSummary(plan, asOfDate);

  return {
    kind: "one-thing-weekly",
    href: ONE_THING_WEEKLY_TRACKER_PATH,
    oneThing: plan.oneThing,
    weekLabel: formatWeekRange(plan.weekStart),
    scorePercent: summary.scorePercent,
    yesCount: summary.yesCount,
    eligibleDays: summary.eligibleDays,
    pendingToday: hasPendingTodayCheckIn(plan, asOfDate),
    weekVisual: buildWeekVisual(plan, asOfDate),
  };
}

export function buildHomeTrackerWidgets(
  savingsPlan: SavingsPathPlan | null,
  weeklyStore: OneThingWeeklyStore | null,
  asOfDate: string,
): HomeTrackerWidgets {
  return {
    savingsPath: buildSavingsPathHomeWidget(savingsPlan, asOfDate),
    oneThingWeekly: buildOneThingWeeklyHomeWidget(weeklyStore, asOfDate),
  };
}

export function hasActiveHomeTrackers(widgets: HomeTrackerWidgets): boolean {
  return Boolean(widgets.savingsPath || widgets.oneThingWeekly);
}
