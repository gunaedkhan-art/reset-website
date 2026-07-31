/** Dispatched when repeat-use tracker data changes in localStorage. */
export const TRACKERS_UPDATED_EVENT = "reset-trackers-updated";

export function notifyTrackersUpdated(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(TRACKERS_UPDATED_EVENT));
}
