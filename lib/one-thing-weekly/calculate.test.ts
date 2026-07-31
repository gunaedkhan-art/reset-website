import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  archiveAndStartWeek,
  buildWeekSummary,
  buildWeekVisual,
  createWeeklyPlan,
  isDayCheckInEnabled,
  needsWeekReview,
  sortCheckInsTodayFirst,
  submitWeekReview,
  updateCheckIn,
} from "./calculate";
import { getMondayOfWeek, getWeekDays } from "./format";
import { buildWeeklyTrackerUrl, parsePrefillFromSearchParams } from "./prefill";

describe("getMondayOfWeek", () => {
  it("returns Monday for a mid-week date", () => {
    assert.equal(getMondayOfWeek("2026-07-29"), "2026-07-27");
  });
});

describe("createWeeklyPlan", () => {
  it("creates seven pending check-ins with lead domino", () => {
    const plan = createWeeklyPlan({
      oneThing: "Finish chapter draft",
      leadDomino: "Write opening paragraph",
      weekStart: "2026-07-27",
    });
    assert.equal(plan.oneThing, "Finish chapter draft");
    assert.equal(plan.leadDomino, "Write opening paragraph");
    assert.equal(plan.checkIns.length, 7);
  });

  it("requires a ONE Thing", () => {
    assert.throws(() => createWeeklyPlan({ oneThing: "   " }), /ONE Thing is required/);
  });
});

describe("updateCheckIn", () => {
  it("stores blocker on partial days", () => {
    let plan = createWeeklyPlan({ oneThing: "Ship feature", weekStart: "2026-07-27" });
    plan = updateCheckIn(plan, "2026-07-28", "partial", "meetings");
    assert.equal(
      plan.checkIns.find((checkIn) => checkIn.date === "2026-07-28")?.blocker,
      "meetings",
    );
  });

  it("clears blocker on yes days", () => {
    let plan = createWeeklyPlan({ oneThing: "Ship feature", weekStart: "2026-07-27" });
    plan = updateCheckIn(plan, "2026-07-28", "partial", "meetings");
    plan = updateCheckIn(plan, "2026-07-28", "yes");
    assert.equal(
      plan.checkIns.find((checkIn) => checkIn.date === "2026-07-28")?.blocker,
      undefined,
    );
  });
});

describe("buildWeekSummary", () => {
  it("excludes weekends when configured", () => {
    const plan = createWeeklyPlan({
      oneThing: "Write",
      weekStart: "2026-07-27",
      excludeWeekends: true,
    });
    const summary = buildWeekSummary(plan, "2026-08-02");
    assert.equal(summary.eligibleDays, 5);
  });

  it("flags top blocker in message when score is low", () => {
    let plan = createWeeklyPlan({ oneThing: "Write", weekStart: "2026-07-27" });
    plan = updateCheckIn(plan, "2026-07-27", "partial", "phone");
    const summary = buildWeekSummary(plan, "2026-07-27");
    assert.equal(summary.topBlocker, "phone");
  });
});

describe("buildWeekVisual", () => {
  it("marks excluded weekends as off", () => {
    const plan = createWeeklyPlan({
      oneThing: "Write",
      weekStart: "2026-07-27",
      excludeWeekends: true,
    });
    const visual = buildWeekVisual(plan, "2026-07-29");
    assert.equal(visual[5]?.status, "off");
    assert.equal(visual[6]?.status, "off");
  });
});

describe("week review", () => {
  it("needs review after week ends without review", () => {
    const plan = createWeeklyPlan({ oneThing: "Write", weekStart: "2026-07-27" });
    assert.equal(needsWeekReview(plan, "2026-08-03"), true);
  });

  it("stores review on submit", () => {
    let plan = createWeeklyPlan({ oneThing: "Write", weekStart: "2026-07-27" });
    plan = submitWeekReview(plan, "partial", "Meetings ate Tuesday.");
    assert.equal(plan.review?.finishedOneThing, "partial");
    assert.equal(needsWeekReview(plan, "2026-08-03"), false);
  });
});

describe("sortCheckInsTodayFirst", () => {
  it("puts today first", () => {
    const plan = createWeeklyPlan({ oneThing: "Write", weekStart: "2026-07-27" });
    const sorted = sortCheckInsTodayFirst(plan.checkIns, "2026-07-29");
    assert.equal(sorted[0]?.date, "2026-07-29");
  });
});

describe("prefill helpers", () => {
  it("builds tracker URL with query params", () => {
    const url = buildWeeklyTrackerUrl({
      oneThing: "Launch blog",
      leadDomino: "Draft outline",
    });
    assert.match(url, /oneThing=Launch/);
    assert.match(url, /leadDomino=Draft/);
  });

  it("parses search params", () => {
    const params = new URLSearchParams("oneThing=Ship&leadDomino=Open+repo");
    assert.deepEqual(parsePrefillFromSearchParams(params), {
      oneThing: "Ship",
      leadDomino: "Open repo",
    });
  });
});

describe("archiveAndStartWeek", () => {
  it("archives the active plan when starting a new week", () => {
    const first = createWeeklyPlan({ oneThing: "First", weekStart: "2026-07-27" });
    const store = archiveAndStartWeek(
      { activePlan: first, archivedWeeks: [] },
      { oneThing: "Second", weekStart: "2026-08-03" },
    );
    assert.equal(store.archivedWeeks.length, 1);
    assert.equal(store.activePlan?.oneThing, "Second");
  });
});

describe("isDayCheckInEnabled", () => {
  it("blocks future days", () => {
    assert.equal(isDayCheckInEnabled("2026-07-30", "2026-07-29"), false);
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
