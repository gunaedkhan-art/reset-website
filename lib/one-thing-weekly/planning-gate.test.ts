import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createWeeklyPlan, updateCheckIn, buildWeekSummaryText } from "./calculate";
import { shouldShowWeeklyTrackerPlanningGate } from "./planning-gate";

const emptyStore = { activePlan: null, archivedWeeks: [] };

describe("shouldShowWeeklyTrackerPlanningGate", () => {
  it("shows for a fresh tracker with no saved weeks", () => {
    assert.equal(
      shouldShowWeeklyTrackerPlanningGate(emptyStore, {
        completedPlanningScore: false,
        dismissedGate: false,
      }),
      true,
    );
  });

  it("hides when an active plan exists", () => {
    const plan = createWeeklyPlan({
      oneThing: "Write",
      weekStart: "2026-07-27",
    });
    assert.equal(
      shouldShowWeeklyTrackerPlanningGate(
        { activePlan: plan, archivedWeeks: [] },
        { completedPlanningScore: false, dismissedGate: false },
      ),
      false,
    );
  });

  it("hides after planning score is complete", () => {
    assert.equal(
      shouldShowWeeklyTrackerPlanningGate(emptyStore, {
        completedPlanningScore: true,
        dismissedGate: false,
      }),
      false,
    );
  });

  it("hides when the user dismisses the gate", () => {
    assert.equal(
      shouldShowWeeklyTrackerPlanningGate(emptyStore, {
        completedPlanningScore: false,
        dismissedGate: true,
      }),
      false,
    );
  });
});

describe("buildWeekSummaryText", () => {
  it("includes ONE Thing, score, and daily log lines", () => {
    let plan = createWeeklyPlan({
      oneThing: "Finish chapter draft",
      leadDomino: "Write opening paragraph",
      weekStart: "2026-07-27",
    });
    plan = updateCheckIn(plan, "2026-07-27", "yes");
    plan = updateCheckIn(plan, "2026-07-28", "partial", "meetings");

    const text = buildWeekSummaryText(plan, "2026-07-28");

    assert.match(text, /Finish chapter draft/);
    assert.match(text, /Lead domino: Write opening paragraph/);
    assert.match(text, /Protected: 1/);
    assert.match(text, /Partial: 1/);
    assert.match(text, /Mon: yes/);
    assert.match(text, /Tue: partial \(Meetings\)/);
  });
});
