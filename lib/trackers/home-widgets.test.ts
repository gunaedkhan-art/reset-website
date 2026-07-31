import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createWeeklyPlan, updateCheckIn } from "@/lib/one-thing-weekly/calculate";
import type { SavingsPathPlan } from "@/lib/savings-path/types";
import {
  buildHomeTrackerWidgets,
  buildOneThingWeeklyHomeWidget,
  buildSavingsPathHomeWidget,
  hasActiveHomeTrackers,
} from "./home-widgets";

const sampleSavingsPlan: SavingsPathPlan = {
  goal: {
    targetAmount: 10000,
    targetDate: "2027-01-01",
    startAmount: 1000,
    startDate: "2026-01-01",
    currency: "USD",
  },
  incomeSources: [],
  checkIns: [
    { id: "1", amount: 2500, date: "2026-07-01" },
  ],
};

describe("buildSavingsPathHomeWidget", () => {
  it("returns null without a plan", () => {
    assert.equal(buildSavingsPathHomeWidget(null), null);
  });

  it("includes on-track status copy", () => {
    const widget = buildSavingsPathHomeWidget(sampleSavingsPlan, "2026-07-01");
    assert.ok(widget);
    assert.match(widget.targetLabel, /10,000/);
    assert.equal(typeof widget.onTrack, "boolean");
  });
});

describe("buildOneThingWeeklyHomeWidget", () => {
  it("returns null without an active plan", () => {
    assert.equal(
      buildOneThingWeeklyHomeWidget(
        { activePlan: null, archivedWeeks: [] },
        "2026-07-29",
      ),
      null,
    );
  });

  it("includes week visual and pending today flag", () => {
    let plan = createWeeklyPlan({
      oneThing: "Finish draft",
      weekStart: "2026-07-27",
    });
    plan = updateCheckIn(plan, "2026-07-27", "yes");

    const widget = buildOneThingWeeklyHomeWidget(
      { activePlan: plan, archivedWeeks: [] },
      "2026-07-29",
    );

    assert.ok(widget);
    assert.equal(widget.oneThing, "Finish draft");
    assert.equal(widget.weekVisual.length, 7);
    assert.equal(widget.pendingToday, true);
  });
});

describe("buildHomeTrackerWidgets", () => {
  it("detects when at least one tracker is active", () => {
    const widgets = buildHomeTrackerWidgets(sampleSavingsPlan, null, "2026-07-01");
    assert.equal(hasActiveHomeTrackers(widgets), true);
    assert.equal(hasActiveHomeTrackers({ savingsPath: null, oneThingWeekly: null }), false);
  });
});
