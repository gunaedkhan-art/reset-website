import {
  buildWeekSummary,
  getWeekEndDate,
  isWeekEnded,
} from "./calculate";
import { formatWeekRange, todayIsoDate } from "./format";
import type { BlockerTag, OneThingWeeklyStore, WeeklyPlan } from "./types";
import { BLOCKER_OPTIONS } from "./types";

export interface WeekHistoryEntry {
  id: string;
  weekStart: string;
  weekLabel: string;
  oneThing: string;
  yesCount: number;
  eligibleDays: number;
  scorePercent: number | null;
  streakDays: number;
  topBlocker: BlockerTag | null;
}

export interface HistoryTrends {
  weeks: WeekHistoryEntry[];
  avgYesDays: number | null;
  avgScorePercent: number | null;
  bestStreakDays: number;
  topBlocker: BlockerTag | null;
  topBlockerLabel: string | null;
}

function blockerLabel(blocker: BlockerTag): string {
  return (
    BLOCKER_OPTIONS.find((option) => option.value === blocker)?.label ?? blocker
  );
}

function summaryDateForWeek(plan: WeeklyPlan, asOfDate: string): string {
  return isWeekEnded(plan, asOfDate)
    ? getWeekEndDate(plan.weekStart)
    : asOfDate;
}

function toHistoryEntry(plan: WeeklyPlan, asOfDate: string): WeekHistoryEntry {
  const evalDate = summaryDateForWeek(plan, asOfDate);
  const summary = buildWeekSummary(plan, evalDate);

  return {
    id: plan.id,
    weekStart: plan.weekStart,
    weekLabel: formatWeekRange(plan.weekStart),
    oneThing: plan.oneThing,
    yesCount: summary.yesCount,
    eligibleDays: summary.eligibleDays,
    scorePercent: summary.scorePercent,
    streakDays: summary.streakDays,
    topBlocker: summary.topBlocker,
  };
}

function weekHasHistory(plan: WeeklyPlan, asOfDate: string): boolean {
  const summary = buildWeekSummary(plan, summaryDateForWeek(plan, asOfDate));
  const logged =
    summary.yesCount + summary.partialCount + summary.skippedCount;
  return logged > 0 || isWeekEnded(plan, asOfDate);
}

function countBlockers(plans: WeeklyPlan[]): BlockerTag | null {
  const counts = new Map<BlockerTag, number>();

  for (const plan of plans) {
    for (const checkIn of plan.checkIns) {
      if (
        (checkIn.status === "partial" || checkIn.status === "skipped") &&
        checkIn.blocker
      ) {
        counts.set(checkIn.blocker, (counts.get(checkIn.blocker) ?? 0) + 1);
      }
    }
  }

  let top: BlockerTag | null = null;
  let topCount = 0;
  for (const [blocker, count] of counts) {
    if (count > topCount) {
      top = blocker;
      topCount = count;
    }
  }

  return top;
}

/** Aggregate trends across up to 12 stored weeks. */
export function buildHistoryTrends(
  store: OneThingWeeklyStore,
  asOfDate?: string,
): HistoryTrends {
  const today = asOfDate ?? todayIsoDate();
  const sourcePlans: WeeklyPlan[] = [];

  if (store.activePlan && weekHasHistory(store.activePlan, today)) {
    sourcePlans.push(store.activePlan);
  }

  sourcePlans.push(...store.archivedWeeks);

  const weeks = sourcePlans
    .slice(0, 12)
    .map((plan) => toHistoryEntry(plan, today));

  if (weeks.length === 0) {
    return {
      weeks: [],
      avgYesDays: null,
      avgScorePercent: null,
      bestStreakDays: 0,
      topBlocker: null,
      topBlockerLabel: null,
    };
  }

  const yesTotal = weeks.reduce((sum, week) => sum + week.yesCount, 0);
  const avgYesDays = Math.round((yesTotal / weeks.length) * 10) / 10;

  const scoredWeeks = weeks.filter((week) => week.scorePercent !== null);
  const avgScorePercent =
    scoredWeeks.length > 0
      ? Math.round(
          scoredWeeks.reduce((sum, week) => sum + week.scorePercent!, 0) /
            scoredWeeks.length,
        )
      : null;

  const bestStreakDays = weeks.reduce(
    (best, week) => Math.max(best, week.streakDays),
    0,
  );

  const topBlocker = countBlockers(sourcePlans.slice(0, 12));
  const topBlockerLabel = topBlocker ? blockerLabel(topBlocker) : null;

  return {
    weeks,
    avgYesDays,
    avgScorePercent,
    bestStreakDays,
    topBlocker,
    topBlockerLabel,
  };
}
