import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  archiveAndStartWeek,
  createWeeklyPlan,
  updateCheckIn,
} from "./calculate";
import { buildHistoryTrends } from "./history";

describe("buildHistoryTrends", () => {
  it("returns empty trends with no stored weeks", () => {
    const trends = buildHistoryTrends(
      { activePlan: null, archivedWeeks: [] },
      "2026-08-03",
    );

    assert.deepEqual(trends.weeks, []);
    assert.equal(trends.avgYesDays, null);
  });

  it("aggregates averages across archived weeks", () => {
    let first = createWeeklyPlan({ oneThing: "First", weekStart: "2026-07-27" });
    first = updateCheckIn(first, "2026-07-27", "yes");
    first = updateCheckIn(first, "2026-07-28", "yes");

    const store = archiveAndStartWeek(
      { activePlan: first, archivedWeeks: [] },
      { oneThing: "Second", weekStart: "2026-08-03" },
    );

    let active = store.activePlan!;
    active = updateCheckIn(active, "2026-08-03", "yes");

    const trends = buildHistoryTrends(
      { activePlan: active, archivedWeeks: store.archivedWeeks },
      "2026-08-05",
    );

    assert.equal(trends.weeks.length, 2);
    assert.equal(trends.avgYesDays, 1.5);
    assert.equal(trends.bestStreakDays, 2);
  });

  it("flags the most common blocker across weeks", () => {
    let first = createWeeklyPlan({ oneThing: "First", weekStart: "2026-07-27" });
    first = updateCheckIn(first, "2026-07-27", "partial", "phone");

    const store = archiveAndStartWeek(
      { activePlan: first, archivedWeeks: [] },
      { oneThing: "Second", weekStart: "2026-08-03" },
    );

    let active = store.activePlan!;
    active = updateCheckIn(active, "2026-08-03", "skipped", "phone");

    const trends = buildHistoryTrends(
      { activePlan: active, archivedWeeks: store.archivedWeeks },
      "2026-08-05",
    );

    assert.equal(trends.topBlocker, "phone");
    assert.equal(trends.topBlockerLabel, "Phone / feeds");
  });
});
