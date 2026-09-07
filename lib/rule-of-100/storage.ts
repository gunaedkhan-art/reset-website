import { notifyTrackersUpdated } from "@/lib/trackers/events";
import type { RuleOf100Store } from "./types";
import { RULE_OF_100_STORAGE_KEY } from "./types";

const emptyStore: RuleOf100Store = {
  activeChallenge: null,
  archivedChallenges: [],
};

/** Keeps a stable object reference for useSyncExternalStore getSnapshot. */
let cachedRaw: string | null | undefined;
let cachedStore: RuleOf100Store = emptyStore;

function parseStore(raw: string): RuleOf100Store | null {
  try {
    const parsed = JSON.parse(raw) as RuleOf100Store;
    return {
      activeChallenge: parsed.activeChallenge ?? null,
      archivedChallenges: parsed.archivedChallenges ?? [],
    };
  } catch {
    return null;
  }
}

export function loadRuleOf100Store(): RuleOf100Store {
  if (typeof window === "undefined") return emptyStore;

  const raw = window.localStorage.getItem(RULE_OF_100_STORAGE_KEY);
  if (raw === cachedRaw) return cachedStore;

  cachedRaw = raw;
  if (!raw) {
    cachedStore = emptyStore;
    return cachedStore;
  }

  cachedStore = parseStore(raw) ?? emptyStore;
  return cachedStore;
}

export function saveRuleOf100Store(store: RuleOf100Store): void {
  if (typeof window === "undefined") return;
  const serialized = JSON.stringify(store);
  window.localStorage.setItem(RULE_OF_100_STORAGE_KEY, serialized);
  cachedRaw = serialized;
  cachedStore = store;
  notifyTrackersUpdated();
}

export function clearRuleOf100Store(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(RULE_OF_100_STORAGE_KEY);
  cachedRaw = null;
  cachedStore = emptyStore;
}
