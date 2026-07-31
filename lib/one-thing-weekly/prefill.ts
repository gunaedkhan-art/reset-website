export interface OneThingPrefill {
  oneThing: string;
  leadDomino?: string;
  source?: string;
  savedAt: string;
}

export function setOneThingPrefill(input: {
  oneThing: string;
  leadDomino?: string;
  source?: string;
}): void {
  if (typeof window === "undefined") return;

  const payload: OneThingPrefill = {
    oneThing: input.oneThing.trim(),
    leadDomino: input.leadDomino?.trim() || undefined,
    source: input.source,
    savedAt: new Date().toISOString(),
  };

  if (!payload.oneThing) return;

  window.localStorage.setItem(
    "reset-one-thing-prefill-v1",
    JSON.stringify(payload),
  );
}

export function consumeOneThingPrefill(): OneThingPrefill | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem("reset-one-thing-prefill-v1");
    if (!raw) return null;
    window.localStorage.removeItem("reset-one-thing-prefill-v1");
    const parsed = JSON.parse(raw) as OneThingPrefill;
    if (!parsed.oneThing?.trim()) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function parsePrefillFromSearchParams(
  params: URLSearchParams,
): Partial<Pick<OneThingPrefill, "oneThing" | "leadDomino">> {
  const oneThing = params.get("oneThing")?.trim();
  const leadDomino = params.get("leadDomino")?.trim();

  return {
    ...(oneThing ? { oneThing } : {}),
    ...(leadDomino ? { leadDomino } : {}),
  };
}

export function buildWeeklyTrackerUrl(options: {
  oneThing: string;
  leadDomino?: string;
}): string {
  const params = new URLSearchParams();
  params.set("oneThing", options.oneThing.trim());
  if (options.leadDomino?.trim()) {
    params.set("leadDomino", options.leadDomino.trim());
  }
  return `/one-thing-weekly-check-in?${params.toString()}`;
}

export const ONE_THING_TIME_BLOCK_PATH = "/protect-your-one-thing-time-block";

/** Deep link to the time-block calculator with ONE Thing context in the query string. */
export function buildTimeBlockUrl(options: { oneThing: string }): string {
  const params = new URLSearchParams();
  params.set("oneThing", options.oneThing.trim());
  return `${ONE_THING_TIME_BLOCK_PATH}?${params.toString()}`;
}
