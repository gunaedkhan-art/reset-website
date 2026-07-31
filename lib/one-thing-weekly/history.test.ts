import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  archiveAndStartWeek,
  createWeeklyPlan,
  updateCheckIn,
} from "./calculate";
import { buildHistoryTrends, buildHistoryTrendsText, buildWeeklyExportText } from "./history";

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

describe("buildHistoryTrendsText", () => {
  it("returns empty with fewer than two weeks", () => {
    const store = {
      activePlan: createWeeklyPlan({ oneThing: "Write", weekStart: "2026-08-03" }),
      archivedWeeks: [],
    };
    const trends = buildHistoryTrends(store, "2026-08-05");
    assert.equal(buildHistoryTrendsText(trends), "");
  });

  it("includes averages and recent week lines", () => {
    let first = createWeeklyPlan({ oneThing: "First week goal", weekStart: "2026-07-27" });
    first = updateCheckIn(first, "2026-07-27", "yes");

    const store = archiveAndStartWeek(
      { activePlan: first, archivedWeeks: [] },
      { oneThing: "Second week goal", weekStart: "2026-08-03" },
    );

    let active = store.activePlan!;
    active = updateCheckIn(active, "2026-08-03", "yes");

    const trends = buildHistoryTrends(
      { activePlan: active, archivedWeeks: store.archivedWeeks },
      "2026-08-05",
    );
    const text = buildHistoryTrendsText(trends);

    assert.match(text, /Trends \(2 weeks\)/);
    assert.match(text, /Avg protected days\/week: 1/);
    assert.match(text, /First week goal/);
    assert.match(text, /Second week goal/);
  });
});

describe("buildWeeklyExportText", () => {
  it("appends trends when two or more weeks exist", () => {
    let first = createWeeklyPlan({ oneThing: "First", weekStart: "2026-07-27" });
    first = updateCheckIn(first, "2026-07-27", "yes");

    const store = archiveAndStartWeek(
      { activePlan: first, archivedWeeks: [] },
      { oneThing: "Second", weekStart: "2026-08-03" },
    );

    let active = store.activePlan!;
    active = updateCheckIn(active, "2026-08-03", "yes");

    const fullStore = { activePlan: active, archivedWeeks: store.archivedWeeks };
    const text = buildWeeklyExportText(fullStore, active, "2026-08-05");

    assert.match(text, /ONE Thing Weekly Check-In/);
    assert.match(text, /Trends \(2 weeks\)/);
  });
});
