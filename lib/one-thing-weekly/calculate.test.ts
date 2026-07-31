import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  archiveAndStartWeek,
  buildWeekSummary,
  createWeeklyPlan,
  isDayCheckInEnabled,
  updateCheckIn,
} from "./calculate";
import { getMondayOfWeek, getWeekDays } from "./format";

describe("getMondayOfWeek", () => {
  it("returns Monday for a mid-week date", () => {
    assert.equal(getMondayOfWeek("2026-07-29"), "2026-07-27");
  });

  it("returns same Monday when date is Monday", () => {
    assert.equal(getMondayOfWeek("2026-07-27"), "2026-07-27");
  });
});

describe("createWeeklyPlan", () => {
  it("creates seven pending check-ins", () => {
    const plan = createWeeklyPlan("Finish chapter draft", "2026-07-27");
    assert.equal(plan.oneThing, "Finish chapter draft");
    assert.equal(plan.checkIns.length, 7);
    assert.equal(plan.checkIns[0]?.date, "2026-07-27");
    assert.equal(plan.checkIns[6]?.date, "2026-08-02");
    assert.ok(plan.checkIns.every((checkIn) => checkIn.status === "pending"));
  });

  it("requires a ONE Thing", () => {
    assert.throws(() => createWeeklyPlan("   "), /ONE Thing is required/);
  });
});

describe("updateCheckIn", () => {
  it("updates a day within the week", () => {
    const plan = createWeeklyPlan("Ship feature", "2026-07-27");
    const updated = updateCheckIn(plan, "2026-07-28", "yes");
    assert.equal(
      updated.checkIns.find((checkIn) => checkIn.date === "2026-07-28")?.status,
      "yes",
    );
  });

  it("rejects dates outside the week", () => {
    const plan = createWeeklyPlan("Ship feature", "2026-07-27");
    assert.throws(
      () => updateCheckIn(plan, "2026-08-10", "yes"),
      /not part of this week/,
    );
  });
});

describe("buildWeekSummary", () => {
  it("scores yes days highly", () => {
    let plan = createWeeklyPlan("Write", "2026-07-27");
    plan = updateCheckIn(plan, "2026-07-27", "yes");
    plan = updateCheckIn(plan, "2026-07-28", "yes");

    const summary = buildWeekSummary(plan, "2026-07-28");
    assert.equal(summary.yesCount, 2);
    assert.equal(summary.scorePercent, 100);
    assert.equal(summary.streakDays, 2);
  });

  it("counts partial days at fifty percent", () => {
    let plan = createWeeklyPlan("Write", "2026-07-27");
    plan = updateCheckIn(plan, "2026-07-27", "yes");
    plan = updateCheckIn(plan, "2026-07-28", "partial");

    const summary = buildWeekSummary(plan, "2026-07-28");
    assert.equal(summary.scorePercent, 75);
    assert.equal(summary.streakDays, 1);
  });

  it("ignores future days when scoring", () => {
    const plan = createWeeklyPlan("Write", "2026-07-27");
    const summary = buildWeekSummary(plan, "2026-07-27");
    assert.equal(summary.eligibleDays, 1);
    assert.equal(summary.pendingCount, 1);
  });
});

describe("archiveAndStartWeek", () => {
  it("archives the active plan when starting a new week", () => {
    const first = createWeeklyPlan("First", "2026-07-27");
    const store = archiveAndStartWeek(
      { activePlan: first, archivedWeeks: [] },
      "Second",
      "2026-08-03",
    );

    assert.equal(store.archivedWeeks.length, 1);
    assert.equal(store.archivedWeeks[0]?.oneThing, "First");
    assert.equal(store.activePlan?.oneThing, "Second");
    assert.equal(store.activePlan?.weekStart, "2026-08-03");
  });
});

describe("isDayCheckInEnabled", () => {
  it("blocks future days", () => {
    assert.equal(isDayCheckInEnabled("2026-07-30", "2026-07-29"), false);
    assert.equal(isDayCheckInEnabled("2026-07-29", "2026-07-29"), true);
  });
});

describe("getWeekDays", () => {
  it("returns Monday through Sunday", () => {
    assert.deepEqual(getWeekDays("2026-07-27"), [
      "2026-07-27",
      "2026-07-28",
      "2026-07-29",
      "2026-07-30",
      "2026-07-31",
      "2026-08-01",
      "2026-08-02",
    ]);
  });
});
