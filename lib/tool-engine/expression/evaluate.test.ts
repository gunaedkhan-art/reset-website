import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  evaluateCondition,
  evaluateExpression,
  ExpressionError,
  runExpressions,
} from "./evaluate";

const baseCtx = {
  inputs: { minutes: 45, salary: 75000, hours: 5 },
  scores: {},
  calcs: {},
  constants: { DAYS: 365, WORK: 2080 },
};

describe("evaluateExpression", () => {
  it("evaluates arithmetic", () => {
    assert.equal(
      evaluateExpression("(inputs.minutes * constants.DAYS) / 60", baseCtx),
      (45 * 365) / 60,
    );
  });

  it("evaluates comparisons", () => {
    assert.equal(evaluateExpression("inputs.hours >= 5", baseCtx), true);
    assert.equal(evaluateExpression("inputs.hours < 3", baseCtx), false);
  });

  it("evaluates logical operators", () => {
    assert.equal(
      evaluateExpression("inputs.hours >= 5 && inputs.salary > 50000", baseCtx),
      true,
    );
    assert.equal(
      evaluateExpression("inputs.hours >= 10 || inputs.salary > 50000", baseCtx),
      true,
    );
  });

  it("evaluates logical operators without short-circuit parse bugs", () => {
    assert.equal(
      evaluateExpression("scores.missing >= 2 && scores.also >= 3", baseCtx),
      false,
    );
  });

  it("evaluates floor()", () => {
    assert.equal(evaluateExpression("floor(7.8)", baseCtx), 7);
    assert.equal(
      evaluateExpression("floor((inputs.minutes * constants.DAYS) / 300)", baseCtx),
      Math.floor((45 * 365) / 300),
    );
  });

  it("evaluates min() and max()", () => {
    assert.equal(evaluateExpression("min(3, 8)", baseCtx), 3);
    assert.equal(evaluateExpression("max(3, 8)", baseCtx), 8);
  });

  it("throws on unknown inputs", () => {
    assert.throws(
      () => evaluateExpression("inputs.unknown + 1", baseCtx),
      ExpressionError,
    );
  });

  it("treats missing scores and calcs as zero", () => {
    assert.equal(evaluateExpression("scores.loop >= 3", baseCtx), false);
    assert.equal(evaluateExpression("calcs.missing + 5", baseCtx), 5);
  });
});

describe("runExpressions", () => {
  it("resolves dependent calcs in order", () => {
    const calcs = runExpressions(
      {
        hoursPerYear: "(inputs.minutes * constants.DAYS) / 60",
        daysPerYear: "calcs.hoursPerYear / 24",
      },
      { ...baseCtx, calcs: {} },
    );

    assert.ok(Math.abs(calcs.hoursPerYear! - 273.75) < 0.01);
    assert.ok(Math.abs(calcs.daysPerYear! - 273.75 / 24) < 0.01);
  });
});

describe("evaluateCondition", () => {
  it("coerces numeric results to boolean", () => {
    assert.equal(evaluateCondition("inputs.hours", baseCtx), true);
    assert.equal(evaluateCondition("inputs.hours >= 10", baseCtx), false);
  });
});
