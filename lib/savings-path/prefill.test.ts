import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getTrackStatus } from "./calculate";
import {
  buildInvestmentGrowthCalculatorUrl,
  buildSavingsGoalCalculatorUrl,
  buildSavingsPathCalculatorPrefill,
  isSavingsPathCalculatorPrefill,
  parseInvestmentPrefillFromSearchParams,
} from "./prefill";
import type { SavingsPathPlan } from "./types";

const basePlan: SavingsPathPlan = {
  goal: {
    targetAmount: 10000,
    targetDate: "2027-01-01",
    startAmount: 1000,
    startDate: "2026-01-01",
    currency: "USD",
  },
  incomeSources: [],
  checkIns: [{ date: "2026-06-01", amount: 4500 }],
};

describe("buildSavingsPathCalculatorPrefill", () => {
  it("uses latest balance and remaining years", () => {
    const prefill = buildSavingsPathCalculatorPrefill(basePlan, "2026-06-15");

    assert.equal(prefill.target_amount, "10000");
    assert.equal(prefill.starting_balance, "4500");
    assert.ok(Number(prefill.years) > 0);
  });
});

describe("calculator prefill URLs", () => {
  it("builds savings goal URL with query params", () => {
    const url = buildSavingsGoalCalculatorUrl(basePlan, "2026-06-15");
    assert.match(url, /\/savings-goal-calculator\?/);
    assert.match(url, /target_amount=10000/);
    assert.match(url, /starting_balance=4500/);
    assert.match(url, /source=savings-path/);
  });

  it("builds growth calculator URL without target amount", () => {
    const url = buildInvestmentGrowthCalculatorUrl(basePlan, "2026-06-15");
    assert.match(url, /\/investment-growth-calculator\?/);
    assert.doesNotMatch(url, /target_amount=/);
    assert.match(url, /starting_balance=4500/);
  });
});

describe("parseInvestmentPrefillFromSearchParams", () => {
  it("reads allowed calculator fields", () => {
    const params = new URLSearchParams(
      "target_amount=10000&starting_balance=4500&years=2&ignored=1",
    );
    const parsed = parseInvestmentPrefillFromSearchParams(params);

    assert.equal(parsed.target_amount, "10000");
    assert.equal(parsed.starting_balance, "4500");
    assert.equal(parsed.years, "2");
    assert.equal("ignored" in parsed, false);
  });
});

describe("isSavingsPathCalculatorPrefill", () => {
  it("detects savings-path source param", () => {
    assert.equal(
      isSavingsPathCalculatorPrefill(new URLSearchParams("source=savings-path")),
      true,
    );
    assert.equal(isSavingsPathCalculatorPrefill(new URLSearchParams()), false);
  });
});

describe("recovery link integration", () => {
  it("prefills from a below-path balance", () => {
    const behindPlan: SavingsPathPlan = {
      ...basePlan,
      checkIns: [{ date: "2026-06-01", amount: 2000 }],
    };
    const status = getTrackStatus(behindPlan.goal, behindPlan.checkIns, "2026-06-15");
    const url = buildSavingsGoalCalculatorUrl(behindPlan, "2026-06-15");

    assert.equal(status.onTrack, false);
    assert.match(url, /starting_balance=2000/);
  });
});
