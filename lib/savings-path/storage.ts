import type { SavingsPathPlan } from "./types";
import { SAVINGS_PATH_STORAGE_KEY } from "./types";

export function loadSavingsPathPlan(): SavingsPathPlan | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(SAVINGS_PATH_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SavingsPathPlan;
  } catch {
    return null;
  }
}

export function saveSavingsPathPlan(plan: SavingsPathPlan): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SAVINGS_PATH_STORAGE_KEY, JSON.stringify(plan));
}

export function clearSavingsPathPlan(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SAVINGS_PATH_STORAGE_KEY);
}
