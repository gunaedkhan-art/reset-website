import {
  formatWeekRange,
  formatWeekdayShort,
  getMondayOfWeek,
  getWeekDays,
  todayIsoDate,
} from "./format";
import type {
  BlockerTag,
  CheckInStatus,
  DailyCheckIn,
  OneThingWeeklyStore,
  WeekOutcome,
  WeekReview,
  WeeklyPlan,
} from "./types";
import { MAX_ARCHIVED_WEEKS } from "./types";
import { parseIsoDate } from "./format";

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
  topBlocker: BlockerTag | null;
}

export interface WeekDayVisual {
  date: string;
  weekdayShort: string;
  status: CheckInStatus | "off";
  isToday: boolean;
  isFuture: boolean;
  blocker?: BlockerTag;
}

export interface CreateWeeklyPlanInput {
  oneThing: string;
  leadDomino?: string;
  weekStart?: string;
  excludeWeekends?: boolean;
}

export function isWeekendDay(isoDate: string): boolean {
  const day = parseIsoDate(isoDate).getDay();
  return day === 0 || day === 6;
}

export function isCheckInDayActive(plan: WeeklyPlan, date: string): boolean {
  if (plan.excludeWeekends && isWeekendDay(date)) return false;
  return true;
}

export function createWeeklyPlan(input: CreateWeeklyPlanInput): WeeklyPlan {
  const trimmed = input.oneThing.trim();
  if (!trimmed) {
    throw new Error("Your ONE Thing is required.");
  }

  const start = input.weekStart ?? getMondayOfWeek(todayIsoDate());
  const checkIns: DailyCheckIn[] = getWeekDays(start).map((date) => ({
    date,
    status: "pending",
  }));

  return {
    id: crypto.randomUUID(),
    oneThing: trimmed,
    leadDomino: input.leadDomino?.trim() || undefined,
    weekStart: start,
    excludeWeekends: input.excludeWeekends ?? false,
    checkIns,
  };
}

export function updateCheckIn(
  plan: WeeklyPlan,
  date: string,
  status: Exclude<CheckInStatus, "pending">,
  blocker?: BlockerTag,
): WeeklyPlan {
  if (!plan.checkIns.some((checkIn) => checkIn.date === date)) {
    throw new Error("That date is not part of this week.");
  }

  const resolvedBlocker =
    status === "yes" ? undefined : blocker ?? undefined;

  return {
    ...plan,
    checkIns: plan.checkIns.map((checkIn) =>
      checkIn.date === date
        ? { ...checkIn, status, blocker: resolvedBlocker }
        : checkIn,
    ),
  };
}

export function sortCheckInsTodayFirst(
  checkIns: DailyCheckIn[],
  today: string,
): DailyCheckIn[] {
  const todayEntry = checkIns.find((checkIn) => checkIn.date === today);
  const rest = checkIns.filter((checkIn) => checkIn.date !== today);
  return todayEntry ? [todayEntry, ...rest] : checkIns;
}

export function getWeekEndDate(weekStart: string): string {
  return getWeekDays(weekStart)[6]!;
}

export function isWeekEnded(plan: WeeklyPlan, asOfDate?: string): boolean {
  const today = asOfDate ?? todayIsoDate();
  return today > getWeekEndDate(plan.weekStart);
}

export function needsWeekReview(plan: WeeklyPlan, asOfDate?: string): boolean {
  return isWeekEnded(plan, asOfDate) && !plan.review;
}

export function submitWeekReview(
  plan: WeeklyPlan,
  finishedOneThing: WeekOutcome,
  reflection: string,
): WeeklyPlan {
  const review: WeekReview = {
    finishedOneThing,
    reflection: reflection.trim(),
    completedAt: todayIsoDate(),
  };

  return { ...plan, review };
}

function countTopBlocker(plan: WeeklyPlan): BlockerTag | null {
  const counts = new Map<BlockerTag, number>();

  for (const checkIn of plan.checkIns) {
    if (
      (checkIn.status === "partial" || checkIn.status === "skipped") &&
      checkIn.blocker
    ) {
      counts.set(checkIn.blocker, (counts.get(checkIn.blocker) ?? 0) + 1);
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
    if (!isCheckInDayActive(plan, day)) continue;

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
  const topBlocker = countTopBlocker(plan);

  let message: string;
  if (today < plan.weekStart) {
    message = "Your week hasn't started yet — set your ONE Thing and protect the first block.";
  } else if (today > weekEnd) {
    if (plan.review) {
      message = "Week reviewed — start next week when you're ready.";
    } else {
      message = "Week complete — finish your review, then plan next week's ONE Thing.";
    }
  } else if (pendingCount > 0 && loggedCount === 0) {
    message = "Check in each day you protected time for your ONE Thing.";
  } else if (scorePercent !== null && scorePercent >= 80) {
    message = "On track — keep defending the block you scheduled.";
  } else if (scorePercent !== null && scorePercent >= 50) {
    message = topBlocker
      ? `Partial progress — ${topBlocker.replace(/-/g, " ")} showed up often. Tighten tomorrow's block.`
      : "Partial progress — tighten tomorrow's block or shrink the ONE Thing.";
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
    topBlocker,
  };
}

export function buildWeekVisual(
  plan: WeeklyPlan,
  asOfDate?: string,
): WeekDayVisual[] {
  const today = asOfDate ?? todayIsoDate();

  return getWeekDays(plan.weekStart).map((date) => {
    const checkIn = plan.checkIns.find((entry) => entry.date === date);
    const active = isCheckInDayActive(plan, date);

    return {
      date,
      weekdayShort: formatWeekdayShort(date),
      status: active ? (checkIn?.status ?? "pending") : "off",
      isToday: date === today,
      isFuture: date > today,
      blocker: checkIn?.blocker,
    };
  });
}

export function archiveAndStartWeek(
  store: OneThingWeeklyStore,
  input: CreateWeeklyPlanInput,
): OneThingWeeklyStore {
  const newPlan = createWeeklyPlan(input);
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

export function hasPendingTodayCheckIn(plan: WeeklyPlan, asOfDate?: string): boolean {
  const today = asOfDate ?? todayIsoDate();
  if (!isCheckInDayActive(plan, today)) return false;
  const checkIn = plan.checkIns.find((entry) => entry.date === today);
  return checkIn?.status === "pending" || checkIn?.status === undefined;
}
