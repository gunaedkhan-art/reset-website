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

import {
  buildTodaySummary,
  type DayScoreBand,
} from "@/lib/rule-of-100/calculate";
import type { RuleOf100Store } from "@/lib/rule-of-100/types";

export const SAVINGS_PATH_TRACKER_PATH = "/savings-path-tracker";
export const ONE_THING_WEEKLY_TRACKER_PATH = "/one-thing-weekly-check-in";
export const RULE_OF_100_TRACKER_PATH = "/rule-of-100-tracker";

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
  ruleOf100: RuleOf100HomeWidget | null;
}

export interface RuleOf100HomeWidget {
  kind: "rule-of-100";
  href: string;
  taskName: string;
  countLabel: string;
  statusLabel: string;
  band: DayScoreBand;
  percent: number;
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

export function buildRuleOf100HomeWidget(
  store: RuleOf100Store | null,
  asOfDate: string,
): RuleOf100HomeWidget | null {
  if (!store?.activeChallenge) return null;

  const summary = buildTodaySummary(store.activeChallenge, asOfDate);
  const statusLabel =
    summary.band === "complete"
      ? "Target hit"
      : summary.band === "partial"
        ? `${summary.percent}% — keep going`
        : summary.band === "low"
          ? `${summary.count} of ${summary.target} logged`
          : "No reps yet today";

  return {
    kind: "rule-of-100",
    href: RULE_OF_100_TRACKER_PATH,
    taskName: store.activeChallenge.taskName,
    countLabel: `${summary.count} / ${summary.target}`,
    statusLabel,
    band: summary.band,
    percent: summary.percent,
  };
}

export function buildHomeTrackerWidgets(
  savingsPlan: SavingsPathPlan | null,
  weeklyStore: OneThingWeeklyStore | null,
  ruleOf100Store: RuleOf100Store | null,
  asOfDate: string,
): HomeTrackerWidgets {
  return {
    savingsPath: buildSavingsPathHomeWidget(savingsPlan, asOfDate),
    oneThingWeekly: buildOneThingWeeklyHomeWidget(weeklyStore, asOfDate),
    ruleOf100: buildRuleOf100HomeWidget(ruleOf100Store, asOfDate),
  };
}

export function hasActiveHomeTrackers(widgets: HomeTrackerWidgets): boolean {
  return Boolean(widgets.savingsPath || widgets.oneThingWeekly || widgets.ruleOf100);
}
