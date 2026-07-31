import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  archiveAndStartWeek,
  createWeeklyPlan,
  updateCheckIn,
} from "./calculate";
import { buildSmartNudge, getWeekScoreAtEnd } from "./nudges";

function lowScoreWeek(oneThing: string, weekStart: string): ReturnType<typeof createWeeklyPlan> {
  let plan = createWeeklyPlan({ oneThing, weekStart });
  plan = updateCheckIn(plan, weekStart, "skipped", "meetings");
  const days = plan.checkIns.map((checkIn) => checkIn.date);
  for (const date of days.slice(1, 4)) {
    plan = updateCheckIn(plan, date, "partial", "meetings");
  }
  return plan;
}

describe("getWeekScoreAtEnd", () => {
  it("returns a low score for mostly missed days", () => {
    const plan = lowScoreWeek("Write", "2026-07-27");
    const score = getWeekScoreAtEnd(plan);
    assert.ok(score !== null && score < 50);
  });
});

describe("buildSmartNudge", () => {
  it("returns fear-of-chaos when two ended weeks score low with meeting blockers", () => {
    const first = lowScoreWeek("First", "2026-07-27");
    const store = archiveAndStartWeek(
      { activePlan: first, archivedWeeks: [] },
      { oneThing: "Second", weekStart: "2026-08-03" },
    );
    let active = store.activePlan!;
    for (const checkIn of active.checkIns) {
      active = updateCheckIn(active, checkIn.date, "skipped", "inbox");
    }
    const nudge = buildSmartNudge(
      { activePlan: active, archivedWeeks: store.archivedWeeks },
      "2026-08-10",
      null,
    );

    assert.ok(nudge);
    assert.equal(nudge.slug, "fear-of-chaos-quiz");
    assert.equal(nudge.latestWeekStart, "2026-08-03");
  });

  it("returns four-thieves when phone is the top blocker", () => {
    const first = lowScoreWeek("First", "2026-07-27");
    const store = archiveAndStartWeek(
      { activePlan: first, archivedWeeks: [] },
      { oneThing: "Second", weekStart: "2026-08-03" },
    );
    let active = store.activePlan!;
    for (const checkIn of active.checkIns) {
      active = updateCheckIn(active, checkIn.date, "skipped", "phone");
    }
    const nudge = buildSmartNudge(
      { activePlan: active, archivedWeeks: store.archivedWeeks },
      "2026-08-10",
      null,
    );

    assert.ok(nudge);
    assert.equal(nudge.slug, "four-thieves-productivity-quiz");
  });

  it("hides when dismissed for the latest low week", () => {
    const first = lowScoreWeek("First", "2026-07-27");
    const store = archiveAndStartWeek(
      { activePlan: first, archivedWeeks: [] },
      { oneThing: "Second", weekStart: "2026-08-03" },
    );
    let active = store.activePlan!;
    for (const checkIn of active.checkIns) {
      active = updateCheckIn(active, checkIn.date, "skipped", "phone");
    }
    const nudge = buildSmartNudge(
      { activePlan: active, archivedWeeks: store.archivedWeeks },
      "2026-08-10",
      "2026-08-03",
    );

    assert.equal(nudge, null);
  });

  it("returns null with only one ended week", () => {
    const plan = lowScoreWeek("Only week", "2026-07-27");
    assert.equal(
      buildSmartNudge(
        { activePlan: plan, archivedWeeks: [] },
        "2026-08-03",
        null,
      ),
      null,
    );
  });
});
