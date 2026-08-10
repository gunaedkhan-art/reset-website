import { formatWeekdayShort, parseIsoDate, toIsoDate, todayIsoDate } from "./format";
import type { RuleOf100Challenge, RuleOf100DayLog } from "./types";
import {
  DEFAULT_DAILY_TARGET,
  MAX_ARCHIVED_CHALLENGES,
  MAX_DAILY_TARGET,
  MIN_DAILY_TARGET,
} from "./types";

export type DayScoreBand = "complete" | "partial" | "low" | "none";

export interface DayHistoryVisual {
  date: string;
  weekdayShort: string;
  count: number;
  target: number;
  percent: number;
  band: DayScoreBand;
  isToday: boolean;
}

export interface CreateChallengeInput {
  taskName: string;
  dailyTarget?: number;
  startDate?: string;
}

export interface UpdateChallengeInput {
  taskName?: string;
  dailyTarget?: number;
}

function sortDayLogs(logs: RuleOf100DayLog[]): RuleOf100DayLog[] {
  return [...logs].sort((a, b) => a.date.localeCompare(b.date));
}

function normalizeTarget(target: number): number {
  if (!Number.isFinite(target)) {
    throw new Error("Daily target must be a number.");
  }
  const rounded = Math.round(target);
  if (rounded < MIN_DAILY_TARGET || rounded > MAX_DAILY_TARGET) {
    throw new Error(
      `Daily target must be between ${MIN_DAILY_TARGET} and ${MAX_DAILY_TARGET}.`,
    );
  }
  return rounded;
}

export function getDayScoreBand(count: number, target: number): DayScoreBand {
  if (count <= 0) return "none";
  if (count >= target) return "complete";
  const percent = getCompletionPercent(count, target);
  if (percent >= 50) return "partial";
  return "low";
}

export function getCompletionPercent(count: number, target: number): number {
  if (target <= 0) return 0;
  return Math.min(100, Math.round((count / target) * 100));
}

export function getDayLog(
  challenge: RuleOf100Challenge,
  date: string,
): RuleOf100DayLog | undefined {
  return challenge.dayLogs.find((log) => log.date === date);
}

export function getTodayCount(challenge: RuleOf100Challenge, date: string): number {
  return getDayLog(challenge, date)?.count ?? 0;
}

export function getTodayTimerSeconds(
  challenge: RuleOf100Challenge,
  date: string,
): number {
  return getDayLog(challenge, date)?.timerSeconds ?? 0;
}

export function createChallenge(input: CreateChallengeInput): RuleOf100Challenge {
  const taskName = input.taskName.trim();
  if (!taskName) {
    throw new Error("Name your Rule of 100 task first.");
  }

  const startDate = input.startDate ?? todayIsoDate();
  const dailyTarget = normalizeTarget(input.dailyTarget ?? DEFAULT_DAILY_TARGET);

  return {
    id: crypto.randomUUID(),
    taskName,
    dailyTarget,
    createdAt: startDate,
    dayLogs: [{ date: startDate, count: 0, timerSeconds: 0 }],
  };
}

export function updateChallengeSettings(
  challenge: RuleOf100Challenge,
  input: UpdateChallengeInput,
): RuleOf100Challenge {
  const taskName = input.taskName?.trim();
  if (input.taskName !== undefined && !taskName) {
    throw new Error("Task name cannot be empty.");
  }

  return {
    ...challenge,
    taskName: taskName ?? challenge.taskName,
    dailyTarget:
      input.dailyTarget !== undefined
        ? normalizeTarget(input.dailyTarget)
        : challenge.dailyTarget,
  };
}

function upsertDayLog(
  challenge: RuleOf100Challenge,
  date: string,
  updater: (existing: RuleOf100DayLog) => RuleOf100DayLog,
): RuleOf100Challenge {
  const existing = getDayLog(challenge, date);
  const nextLog = updater(
    existing ?? {
      date,
      count: 0,
      timerSeconds: 0,
    },
  );

  const dayLogs = existing
    ? challenge.dayLogs.map((log) => (log.date === date ? nextLog : log))
    : [...challenge.dayLogs, nextLog];

  return {
    ...challenge,
    dayLogs: sortDayLogs(dayLogs),
  };
}

export function setDayCount(
  challenge: RuleOf100Challenge,
  date: string,
  count: number,
): RuleOf100Challenge {
  if (!Number.isFinite(count)) {
    throw new Error("Count must be a number.");
  }

  const normalized = Math.max(0, Math.round(count));
  return upsertDayLog(challenge, date, (log) => ({
    ...log,
    count: normalized,
  }));
}

export function incrementDayCount(
  challenge: RuleOf100Challenge,
  date: string,
  delta: number,
): RuleOf100Challenge {
  const current = getTodayCount(challenge, date);
  return setDayCount(challenge, date, current + delta);
}

export function addTimerSeconds(
  challenge: RuleOf100Challenge,
  date: string,
  seconds: number,
): RuleOf100Challenge {
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return challenge;
  }

  return upsertDayLog(challenge, date, (log) => ({
    ...log,
    timerSeconds: (log.timerSeconds ?? 0) + Math.round(seconds),
  }));
}

export function resetDay(challenge: RuleOf100Challenge, date: string): RuleOf100Challenge {
  return upsertDayLog(challenge, date, (log) => ({
    ...log,
    count: 0,
    timerSeconds: 0,
  }));
}

export function buildDayHistoryVisual(
  challenge: RuleOf100Challenge,
  asOfDate: string,
  days = 14,
): DayHistoryVisual[] {
  const result: DayHistoryVisual[] = [];

  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const date = parseIsoDate(asOfDate);
    date.setDate(date.getDate() - offset);
    const isoDate = toIsoDate(date);
    const count = getTodayCount(challenge, isoDate);
    const target = challenge.dailyTarget;

    result.push({
      date: isoDate,
      weekdayShort: formatWeekdayShort(isoDate),
      count,
      target,
      percent: getCompletionPercent(count, target),
      band: getDayScoreBand(count, target),
      isToday: isoDate === asOfDate,
    });
  }

  return result;
}

export function archiveChallenge(
  store: { activeChallenge: RuleOf100Challenge | null; archivedChallenges: RuleOf100Challenge[] },
  challenge: RuleOf100Challenge,
): {
  activeChallenge: RuleOf100Challenge | null;
  archivedChallenges: RuleOf100Challenge[];
} {
  const archivedChallenges = [challenge, ...store.archivedChallenges].slice(
    0,
    MAX_ARCHIVED_CHALLENGES,
  );

  return {
    activeChallenge: null,
    archivedChallenges,
  };
}

export function getStreakDays(
  challenge: RuleOf100Challenge,
  asOfDate: string,
): number {
  let streak = 0;
  const cursor = parseIsoDate(asOfDate);

  while (true) {
    const isoDate = toIsoDate(cursor);
    const count = getTodayCount(challenge, isoDate);
    if (count < challenge.dailyTarget) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
    if (isoDate < challenge.createdAt) break;
  }

  return streak;
}

export function buildTodaySummary(
  challenge: RuleOf100Challenge,
  asOfDate: string,
): {
  count: number;
  target: number;
  percent: number;
  band: DayScoreBand;
  streakDays: number;
  timerSeconds: number;
  message: string;
} {
  const count = getTodayCount(challenge, asOfDate);
  const target = challenge.dailyTarget;
  const percent = getCompletionPercent(count, target);
  const band = getDayScoreBand(count, target);
  const streakDays = getStreakDays(challenge, asOfDate);
  const timerSeconds = getTodayTimerSeconds(challenge, asOfDate);

  let message = "Log your first rep to start today's line.";
  if (band === "complete") {
    message = `You hit ${target} — lead measure done for today.`;
  } else if (band === "partial") {
    message = `${target - count} reps to reach your daily ${target}.`;
  } else if (band === "low") {
    message = `Keep going — ${count} of ${target} logged so far.`;
  }

  return {
    count,
    target,
    percent,
    band,
    streakDays,
    timerSeconds,
    message,
  };
}
