import type { OneThingWeeklyStore, WeeklyPlan } from "./types";
import {
  ONE_THING_WEEKLY_STORAGE_KEY,
  ONE_THING_WEEKLY_STORAGE_KEY_V1,
} from "./types";

const emptyStore: OneThingWeeklyStore = {
  activePlan: null,
  archivedWeeks: [],
};

function normalizePlan(plan: WeeklyPlan): WeeklyPlan {
  return {
    ...plan,
    excludeWeekends: plan.excludeWeekends ?? false,
    checkIns: plan.checkIns.map((checkIn) => ({
      ...checkIn,
      blocker: checkIn.blocker,
    })),
  };
}

function parseStore(raw: string): OneThingWeeklyStore | null {
  try {
    const parsed = JSON.parse(raw) as OneThingWeeklyStore;
    return {
      activePlan: parsed.activePlan ? normalizePlan(parsed.activePlan) : null,
      archivedWeeks: (parsed.archivedWeeks ?? []).map(normalizePlan),
    };
  } catch {
    return null;
  }
}

export function loadOneThingWeeklyStore(): OneThingWeeklyStore {
  if (typeof window === "undefined") return emptyStore;

  const v2Raw = window.localStorage.getItem(ONE_THING_WEEKLY_STORAGE_KEY);
  if (v2Raw) {
    return parseStore(v2Raw) ?? emptyStore;
  }

  const v1Raw = window.localStorage.getItem(ONE_THING_WEEKLY_STORAGE_KEY_V1);
  if (v1Raw) {
    const migrated = parseStore(v1Raw);
    if (migrated) {
      saveOneThingWeeklyStore(migrated);
      window.localStorage.removeItem(ONE_THING_WEEKLY_STORAGE_KEY_V1);
      return migrated;
    }
  }

  return emptyStore;
}

export function saveOneThingWeeklyStore(store: OneThingWeeklyStore): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ONE_THING_WEEKLY_STORAGE_KEY, JSON.stringify(store));
}

export function clearOneThingWeeklyStore(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ONE_THING_WEEKLY_STORAGE_KEY);
  window.localStorage.removeItem(ONE_THING_WEEKLY_STORAGE_KEY_V1);
}
