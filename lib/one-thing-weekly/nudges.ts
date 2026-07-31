import { buildWeekSummary, getWeekEndDate, isWeekEnded } from "./calculate";
import type { BlockerTag, OneThingWeeklyStore, WeeklyPlan } from "./types";

export const SMART_NUDGE_DISMISSED_KEY = "reset-one-thing-weekly-smart-nudge-dismissed-v1";

export const LOW_WEEK_SCORE_THRESHOLD = 50;

const CHAOS_BLOCKERS = new Set<BlockerTag>([
  "meetings",
  "inbox",
  "unclear-task",
  "too-big",
]);

export interface WeeklyTrackerNudge {
  slug: "four-thieves-productivity-quiz" | "fear-of-chaos-quiz";
  title: string;
  description: string;
  href: string;
  reason: string;
  latestWeekStart: string;
}

export function dismissSmartNudge(latestWeekStart: string): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SMART_NUDGE_DISMISSED_KEY, latestWeekStart);
}

export function getSmartNudgeDismissedWeekStart(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(SMART_NUDGE_DISMISSED_KEY);
}

export function getEndedWeeks(
  store: OneThingWeeklyStore,
  asOfDate: string,
): WeeklyPlan[] {
  const weeks: WeeklyPlan[] = [];

  if (store.activePlan && isWeekEnded(store.activePlan, asOfDate)) {
    weeks.push(store.activePlan);
  }

  weeks.push(...store.archivedWeeks);

  return weeks.sort((a, b) => a.weekStart.localeCompare(b.weekStart));
}

export function getWeekScoreAtEnd(plan: WeeklyPlan): number | null {
  return buildWeekSummary(plan, getWeekEndDate(plan.weekStart)).scorePercent;
}

function countBlockers(plans: WeeklyPlan[]): Map<BlockerTag, number> {
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

  return counts;
}

function topBlockerFromCounts(counts: Map<BlockerTag, number>): BlockerTag | null {
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

function recommendQuizSlug(topBlocker: BlockerTag | null): WeeklyTrackerNudge["slug"] {
  if (topBlocker && CHAOS_BLOCKERS.has(topBlocker)) {
    return "fear-of-chaos-quiz";
  }

  return "four-thieves-productivity-quiz";
}

function buildReason(
  slug: WeeklyTrackerNudge["slug"],
  topBlocker: BlockerTag | null,
): string {
  if (slug === "fear-of-chaos-quiz") {
    if (topBlocker === "meetings" || topBlocker === "inbox") {
      return "Meetings and reactive work showed up often — fear of chaos may be pulling you off the ONE Thing.";
    }
    if (topBlocker === "too-big" || topBlocker === "unclear-task") {
      return "Your ONE Thing may feel too big or unclear — chaos batching can help you protect one priority.";
    }
    return "Two low-scoring weeks often mean fear of chaos — everything else feels urgent when you focus.";
  }

  if (topBlocker === "phone") {
    return "Phone and feeds were common blockers — the environment thief may be stealing your block.";
  }
  if (topBlocker === "low-energy") {
    return "Low energy showed up often — poor health habits are one of Keller's four thieves.";
  }

  return "Two low-scoring weeks in a row — diagnose which thief is stealing your ONE Thing.";
}

const NUDGE_COPY: Record<
  WeeklyTrackerNudge["slug"],
  Pick<WeeklyTrackerNudge, "title" | "description" | "href">
> = {
  "fear-of-chaos-quiz": {
    title: "Try the Fear of Chaos Quiz",
    description:
      "If focusing on one thing makes everything else feel urgent, Keller's chaos thief may be the pattern — get a batching plan.",
    href: "/fear-of-chaos-quiz",
  },
  "four-thieves-productivity-quiz": {
    title: "Try the Four Thieves Quiz",
    description:
      "Find which thief — can't say no, chaos, health, or environment — is pulling you off your ONE Thing each week.",
    href: "/four-thieves-productivity-quiz",
  },
};

/** Suggest a diagnostic when two ended weeks score below 50%. */
export function buildSmartNudge(
  store: OneThingWeeklyStore,
  asOfDate: string,
  dismissedWeekStart: string | null = getSmartNudgeDismissedWeekStart(),
): WeeklyTrackerNudge | null {
  const endedWeeks = getEndedWeeks(store, asOfDate);
  if (endedWeeks.length < 2) return null;

  const recent = endedWeeks.slice(-2);
  const scores = recent.map((plan) => getWeekScoreAtEnd(plan));

  if (scores.some((score) => score === null || score >= LOW_WEEK_SCORE_THRESHOLD)) {
    return null;
  }

  const latestWeekStart = recent[1]!.weekStart;
  if (dismissedWeekStart === latestWeekStart) return null;

  const topBlocker = topBlockerFromCounts(countBlockers(recent));
  const slug = recommendQuizSlug(topBlocker);
  const copy = NUDGE_COPY[slug];

  return {
    slug,
    ...copy,
    reason: buildReason(slug, topBlocker),
    latestWeekStart,
  };
}
