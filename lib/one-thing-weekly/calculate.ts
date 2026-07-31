import {
  formatWeekRange,
  getMondayOfWeek,
  getWeekDays,
  todayIsoDate,
} from "./format";
import type {
  CheckInStatus,
  DailyCheckIn,
  OneThingWeeklyStore,
  WeeklyPlan,
} from "./types";
import { MAX_ARCHIVED_WEEKS } from "./types";

export interface WeekSummary {
  yesCount: number;
  partialCount: number;
  skippedCount: number;
  pendingCount: number;
  eligibleDays: number;
  scorePercent: number | null;
  streakDays: number;
  message: string;
  weekLabel: string;
}

export function createWeeklyPlan(oneThing: string, weekStart?: string): WeeklyPlan {
  const trimmed = oneThing.trim();
  if (!trimmed) {
    throw new Error("Your ONE Thing is required.");
  }

  const start = weekStart ?? getMondayOfWeek(todayIsoDate());
  const checkIns: DailyCheckIn[] = getWeekDays(start).map((date) => ({
    date,
    status: "pending",
  }));

  return {
    id: crypto.randomUUID(),
    oneThing: trimmed,
    weekStart: start,
    checkIns,
  };
}

export function updateCheckIn(
  plan: WeeklyPlan,
  date: string,
  status: Exclude<CheckInStatus, "pending">,
): WeeklyPlan {
  if (!plan.checkIns.some((checkIn) => checkIn.date === date)) {
    throw new Error("That date is not part of this week.");
  }

  return {
    ...plan,
    checkIns: plan.checkIns.map((checkIn) =>
      checkIn.date === date ? { ...checkIn, status } : checkIn,
    ),
  };
}

export function buildWeekSummary(plan: WeeklyPlan, asOfDate?: string): WeekSummary {
  const today = asOfDate ?? todayIsoDate();
  const weekDays = getWeekDays(plan.weekStart);
  const weekEnd = weekDays[6]!;

  let yesCount = 0;
  let partialCount = 0;
  let skippedCount = 0;
  let pendingCount = 0;
  let eligibleDays = 0;
  let loggedScoreSum = 0;
  let loggedCount = 0;
  let streakDays = 0;
  let streakBroken = false;

  for (const day of weekDays) {
    if (day > today) break;

    eligibleDays++;
    const checkIn = plan.checkIns.find((entry) => entry.date === day);
    const status = checkIn?.status ?? "pending";

    if (status === "yes") {
      yesCount++;
      loggedScoreSum += 100;
      loggedCount++;
      if (!streakBroken) streakDays++;
    } else if (status === "partial") {
      partialCount++;
      loggedScoreSum += 50;
      loggedCount++;
      streakBroken = true;
    } else if (status === "skipped") {
      skippedCount++;
      loggedCount++;
      streakBroken = true;
    } else {
      pendingCount++;
    }
  }

  const scorePercent =
    loggedCount > 0 ? Math.round(loggedScoreSum / loggedCount) : null;

  let message: string;
  if (today < plan.weekStart) {
    message = "Your week hasn't started yet — set your ONE Thing and protect the first block.";
  } else if (today > weekEnd) {
    message =
      yesCount >= 4
        ? "Strong week — your ONE Thing got real calendar time."
        : "Week complete. Note what blocked your ONE Thing before planning next week.";
  } else if (pendingCount > 0 && loggedCount === 0) {
    message = "Check in each day you protected time for your ONE Thing.";
  } else if (scorePercent !== null && scorePercent >= 80) {
    message = "On track — keep defending the block you scheduled.";
  } else if (scorePercent !== null && scorePercent >= 50) {
    message = "Partial progress — tighten tomorrow's block or shrink the ONE Thing.";
  } else {
    message =
      "Your ONE Thing needs a protected block — schedule it before everything else.";
  }

  return {
    yesCount,
    partialCount,
    skippedCount,
    pendingCount,
    eligibleDays,
    scorePercent,
    streakDays,
    message,
    weekLabel: formatWeekRange(plan.weekStart),
  };
}

export function archiveAndStartWeek(
  store: OneThingWeeklyStore,
  oneThing: string,
  weekStart?: string,
): OneThingWeeklyStore {
  const newPlan = createWeeklyPlan(oneThing, weekStart);
  const archived = store.activePlan
    ? [store.activePlan, ...store.archivedWeeks].slice(0, MAX_ARCHIVED_WEEKS)
    : store.archivedWeeks;

  return {
    activePlan: newPlan,
    archivedWeeks: archived,
  };
}

export function isDayCheckInEnabled(date: string, asOfDate?: string): boolean {
  const today = asOfDate ?? todayIsoDate();
  return date <= today;
}
