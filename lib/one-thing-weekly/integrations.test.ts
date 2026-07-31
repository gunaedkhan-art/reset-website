import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getWeeklyTrackerSuggestions,
  shouldOfferWeeklyTracker,
} from "./integrations";
import type { DecisionTreeState } from "@/lib/tool-engine/modes/decision-tree";
import type { ResultTemplate } from "@/lib/tool-engine/schema/tool-config";

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

  it("shows for lead domino tool when complete", () => {
    assert.equal(
      shouldOfferWeeklyTracker(
        "whats-my-lead-domino",
        completeState({ resultTemplateId: "shrink" }),
      ),
      true,
    );
  });

  it("shows for weekly planning score when complete", () => {
    assert.equal(
      shouldOfferWeeklyTracker(
        "weekly-planning-score",
        completeState({ resultTemplateId: "reactive" }),
      ),
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

describe("getWeeklyTrackerSuggestions", () => {
  const templateContext = {
    inputs: {},
    scores: {},
    calcs: {},
    constants: {},
    answers: {},
  };

  it("prefills lead domino from whats-my-lead-domino ask card", () => {
    const suggestions = getWeeklyTrackerSuggestions(
      "whats-my-lead-domino",
      {
        id: "shrink",
        cards: [
          {
            title: "Lead domino type",
            valueTemplate: "Micro-domino",
            descriptionTemplate: "Shrink until it fits in 5 minutes.",
          },
          {
            title: "Ask",
            valueTemplate: "What's the smallest physical start?",
            descriptionTemplate: "Open the file, write the title, send one email.",
          },
        ],
      } satisfies ResultTemplate,
      templateContext,
    );

    assert.equal(suggestions.leadDomino, "Open the file, write the title, send one email.");
    assert.equal(suggestions.oneThing, "");
  });
});
