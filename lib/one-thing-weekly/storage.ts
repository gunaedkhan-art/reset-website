import type { OneThingWeeklyStore } from "./types";
import { ONE_THING_WEEKLY_STORAGE_KEY } from "./types";

const emptyStore: OneThingWeeklyStore = {
  activePlan: null,
  archivedWeeks: [],
};

export function loadOneThingWeeklyStore(): OneThingWeeklyStore {
  if (typeof window === "undefined") return emptyStore;

  try {
    const raw = window.localStorage.getItem(ONE_THING_WEEKLY_STORAGE_KEY);
    if (!raw) return emptyStore;
    return JSON.parse(raw) as OneThingWeeklyStore;
  } catch {
    return emptyStore;
  }
}

export function saveOneThingWeeklyStore(store: OneThingWeeklyStore): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ONE_THING_WEEKLY_STORAGE_KEY, JSON.stringify(store));
}

export function clearOneThingWeeklyStore(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(ONE_THING_WEEKLY_STORAGE_KEY);
}
