import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { shouldOfferWeeklyTracker } from "./integrations";
import type { DecisionTreeState } from "@/lib/tool-engine/modes/decision-tree";

function completeState(
  overrides: Partial<DecisionTreeState> = {},
): DecisionTreeState {
  return {
    currentNodeId: "result_weekly",
    answers: {},
    scores: {},
    calcs: {},
    complete: true,
    resultTemplateId: "weekly",
    ...overrides,
  };
}

describe("shouldOfferWeeklyTracker", () => {
  it("shows for focusing question when horizon is week", () => {
    assert.equal(
      shouldOfferWeeklyTracker(
        "the-focusing-question",
        completeState({
          answers: { q_horizon: "week" },
          resultTemplateId: "framework",
        }),
      ),
      true,
    );
  });

  it("shows for goal setting weekly result", () => {
    assert.equal(
      shouldOfferWeeklyTracker("goal-setting-to-the-now", completeState()),
      true,
    );
  });

  it("hides for unrelated tools", () => {
    assert.equal(
      shouldOfferWeeklyTracker("why-am-i-procrastinating", completeState()),
      false,
    );
  });
});
