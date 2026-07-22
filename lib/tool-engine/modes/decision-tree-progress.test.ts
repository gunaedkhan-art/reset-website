import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  answerQuestion,
  createDecisionTreeState,
} from "./decision-tree";
import { getDecisionTreeProgress, minQuestionsToResult } from "./decision-tree-progress";

const phoneCheckFlow = {
  type: "decision-tree" as const,
  entry: "q_frequency",
  nodes: {
    q_frequency: {
      type: "question" as const,
      id: "q_frequency",
      prompt: "Q1",
      input: "single-choice" as const,
      options: [{ id: "a", label: "A", next: "q_first" }],
    },
    q_first: {
      type: "question" as const,
      id: "q_first",
      prompt: "Q2",
      input: "single-choice" as const,
      options: [{ id: "a", label: "A", next: "q_location" }],
    },
    q_location: {
      type: "question" as const,
      id: "q_location",
      prompt: "Q3",
      input: "single-choice" as const,
      options: [{ id: "a", label: "A", next: "q_after" }],
    },
    q_after: {
      type: "question" as const,
      id: "q_after",
      prompt: "Q4",
      input: "single-choice" as const,
      options: [{ id: "a", label: "A", next: "branch_result" }],
    },
    branch_result: {
      type: "branch" as const,
      id: "branch_result",
      conditions: [{ when: "scores.loop >= 3", next: "result_general" }],
      default: "result_general",
    },
    result_general: {
      type: "result" as const,
      id: "result_general",
      resultTemplateId: "general",
    },
  },
};

describe("minQuestionsToResult", () => {
  it("counts questions through branch nodes", () => {
    assert.equal(minQuestionsToResult(phoneCheckFlow, "q_frequency"), 4);
    assert.equal(minQuestionsToResult(phoneCheckFlow, "q_first"), 3);
  });
});

describe("getDecisionTreeProgress", () => {
  it("updates as the user answers", () => {
    let state = createDecisionTreeState(phoneCheckFlow);
    assert.deepEqual(getDecisionTreeProgress(phoneCheckFlow, state), {
      current: 1,
      total: 4,
      percent: 25,
    });

    state = answerQuestion(phoneCheckFlow, state, "a");
    assert.deepEqual(getDecisionTreeProgress(phoneCheckFlow, state), {
      current: 2,
      total: 4,
      percent: 50,
    });
  });

  it("completes branch conditions without unknown score errors", () => {
    let state = createDecisionTreeState(phoneCheckFlow);
    state = answerQuestion(phoneCheckFlow, state, "a");
    state = answerQuestion(phoneCheckFlow, state, "a");
    state = answerQuestion(phoneCheckFlow, state, "a");
    state = answerQuestion(phoneCheckFlow, state, "a");

    assert.equal(state.complete, true);
    assert.equal(state.resultTemplateId, "general");
  });
});
