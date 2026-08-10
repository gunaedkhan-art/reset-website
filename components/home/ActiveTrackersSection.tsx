"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { WeekCheckInStrip } from "@/components/ui/WeekCheckInStrip";
import { Section } from "@/components/ui/Section";
import { loadOneThingWeeklyStore } from "@/lib/one-thing-weekly/storage";
import { todayIsoDate } from "@/lib/one-thing-weekly/format";
import { loadSavingsPathPlan } from "@/lib/savings-path/storage";
import { loadRuleOf100Store } from "@/lib/rule-of-100/storage";
import { clusterThemes } from "@/lib/tools/cluster-themes";
import { TRACKERS_UPDATED_EVENT } from "@/lib/trackers/events";
import {
  buildHomeTrackerWidgets,
  hasActiveHomeTrackers,
  type HomeTrackerWidgets,
} from "@/lib/trackers/home-widgets";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics/track-client";

const emptyWidgets: HomeTrackerWidgets = {
  savingsPath: null,
  oneThingWeekly: null,
  ruleOf100: null,
};

function readHomeTrackerWidgets() {
  if (typeof window === "undefined") return emptyWidgets;

  return buildHomeTrackerWidgets(
    loadSavingsPathPlan(),
    loadOneThingWeeklyStore(),
    loadRuleOf100Store(),
    todayIsoDate(),
  );
}

function subscribeToTrackerUpdates(onStoreChange: () => void) {
  const handler = () => onStoreChange();
  window.addEventListener(TRACKERS_UPDATED_EVENT, handler);
  window.addEventListener("storage", handler);
  window.addEventListener("focus", handler);
  return () => {
    window.removeEventListener(TRACKERS_UPDATED_EVENT, handler);
    window.removeEventListener("storage", handler);
    window.removeEventListener("focus", handler);
  };
}

let cachedWidgetsSnapshot = JSON.stringify(emptyWidgets);
let cachedWidgets: HomeTrackerWidgets = emptyWidgets;

function getTrackerWidgetsSnapshot() {
  const widgets = readHomeTrackerWidgets();
  const nextSnapshot = JSON.stringify(widgets);
  if (nextSnapshot !== cachedWidgetsSnapshot) {
    cachedWidgetsSnapshot = nextSnapshot;
    cachedWidgets = widgets;
  }
  return cachedWidgets;
}

/** Shows compact continue cards when repeat-use trackers have saved local data. */
export function ActiveTrackersSection() {
  const widgets = useSyncExternalStore(
    subscribeToTrackerUpdates,
    getTrackerWidgetsSnapshot,
    () => emptyWidgets,
  );

  if (!hasActiveHomeTrackers(widgets)) return null;

  const savingsTheme = clusterThemes.money;
  const weeklyTheme = clusterThemes["one-thing"];
  const ruleOf100Theme = clusterThemes.productivity;

  const bandBadgeClass = (band: "complete" | "partial" | "low" | "none") => {
    if (band === "complete") return "bg-emerald-50 text-emerald-800";
    if (band === "partial") return "bg-amber-50 text-amber-900";
    if (band === "low") return "bg-rose-50 text-rose-800";
    return "bg-neutral-100 text-neutral-600";
  };

  return (
    <Section spacing="md" className="border-b border-neutral-100 bg-white">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">
          Continue your trackers
        </h2>
        <p className="mt-2 max-w-2xl text-neutral-600">
          Pick up where you left off — saved locally on this device.
        </p>
      </div>

      <ul className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {widgets.savingsPath && (
          <li>
            <Link
              href={widgets.savingsPath.href}
              onClick={() => {
                trackEvent({
                  name: "tracker_continue_click",
                  tracker_kind: "savings-path",
                });
              }}
              className="group block rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition-colors hover:border-neutral-300 hover:bg-neutral-50/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p
                    className="text-xs font-semibold uppercase tracking-wider"
                    style={{ color: savingsTheme.primary }}
                  >
                    Savings Path
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-neutral-900">
                    {widgets.savingsPath.balanceLabel}
                  </p>
                  <p className="mt-1 text-sm text-neutral-600">
                    {widgets.savingsPath.targetLabel}
                  </p>
                </div>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-1 text-xs font-medium",
                    widgets.savingsPath.onTrack
                      ? "bg-emerald-50 text-emerald-800"
                      : "bg-amber-50 text-amber-900",
                  )}
                >
                  {widgets.savingsPath.statusLabel}
                </span>
              </div>
              <p className="mt-4 text-sm font-medium text-neutral-700 group-hover:text-neutral-900">
                Open tracker →
              </p>
            </Link>
          </li>
        )}

        {widgets.oneThingWeekly && (
          <li>
            <Link
              href={widgets.oneThingWeekly.href}
              onClick={() => {
                trackEvent({
                  name: "tracker_continue_click",
                  tracker_kind: "one-thing-weekly",
                });
              }}
              className="group block rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition-colors hover:border-neutral-300 hover:bg-neutral-50/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p
                    className="text-xs font-semibold uppercase tracking-wider"
                    style={{ color: weeklyTheme.primary }}
                  >
                    ONE Thing this week
                  </p>
                  <p className="mt-2 line-clamp-2 text-base font-semibold text-neutral-900">
                    {widgets.oneThingWeekly.oneThing}
                  </p>
                  <p className="mt-1 text-sm text-neutral-600">
                    {widgets.oneThingWeekly.weekLabel}
                  </p>
                </div>
                {widgets.oneThingWeekly.scorePercent !== null && (
                  <span className="shrink-0 rounded-full bg-sky-50 px-2.5 py-1 text-xs font-medium text-sky-900">
                    {widgets.oneThingWeekly.yesCount}/
                    {widgets.oneThingWeekly.eligibleDays} yes
                  </span>
                )}
              </div>

              <div className="mt-4">
                <WeekCheckInStrip days={widgets.oneThingWeekly.weekVisual} />
              </div>

              {widgets.oneThingWeekly.pendingToday && (
                <p className="mt-3 text-sm font-medium text-amber-800">
                  Today&apos;s check-in is still open
                </p>
              )}

              <p className="mt-4 text-sm font-medium text-neutral-700 group-hover:text-neutral-900">
                Open tracker →
              </p>
            </Link>
          </li>
        )}

        {widgets.ruleOf100 && (
          <li>
            <Link
              href={widgets.ruleOf100.href}
              onClick={() => {
                trackEvent({
                  name: "tracker_continue_click",
                  tracker_kind: "rule-of-100",
                });
              }}
              className="group block rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition-colors hover:border-neutral-300 hover:bg-neutral-50/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p
                    className="text-xs font-semibold uppercase tracking-wider"
                    style={{ color: ruleOf100Theme.primary }}
                  >
                    Rule of 100
                  </p>
                  <p className="mt-2 line-clamp-2 text-base font-semibold text-neutral-900">
                    {widgets.ruleOf100.taskName}
                  </p>
                  <p className="mt-1 text-sm text-neutral-600">Today&apos;s reps</p>
                </div>
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2.5 py-1 text-xs font-medium",
                    bandBadgeClass(widgets.ruleOf100.band),
                  )}
                >
                  {widgets.ruleOf100.countLabel}
                </span>
              </div>
              <p className="mt-4 text-sm text-neutral-600">{widgets.ruleOf100.statusLabel}</p>
              <p className="mt-4 text-sm font-medium text-neutral-700 group-hover:text-neutral-900">
                Open tracker →
              </p>
            </Link>
          </li>
        )}
      </ul>
    </Section>
  );
}
