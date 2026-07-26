import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  compoundLumpSumGrowth,
  doublingTimeYears,
  projectDoublingTime,
  projectInitialInvestment,
  projectInvestment,
  projectRequiredReturn,
  projectSavingsGoal,
  projectTimeToGoal,
  projectWithdrawalDuration,
  ruleOf72Years,
  solveRequiredContribution,
} from "./simulate";
import type { InvestmentInputs } from "./types";

const baseInputs: InvestmentInputs = {
  starting_balance: 10_000,
  annual_return_rate: 7,
  years: 10,
  contribution_amount: 500,
  contribution_frequency: "monthly",
  contribution_timing: "end",
  compounding_frequency: "monthly",
};

describe("compoundLumpSumGrowth", () => {
  it("grows a lump sum with monthly compounding", () => {
    const result = compoundLumpSumGrowth(10_000, 7, 10, "monthly");
    assert.ok(result.finalBalance > 10_000);
    assert.equal(result.totalContributions, 0);
    assert.ok(result.totalGrowth > 0);
    assert.equal(result.yearlyRows.length, 10);
  });

  it("returns higher balance with more frequent compounding at same nominal rate", () => {
    const monthly = compoundLumpSumGrowth(10_000, 7, 10, "monthly");
    const annually = compoundLumpSumGrowth(10_000, 7, 10, "annually");
    assert.ok(monthly.finalBalance >= annually.finalBalance);
  });
});

describe("projectInvestment", () => {
  it("includes contributions and growth", () => {
    const result = projectInvestment(baseInputs);
    assert.ok(result.finalBalance > baseInputs.starting_balance);
    assert.ok(result.totalContributions > 0);
    assert.ok(result.totalGrowth > 0);
  });

  it("returns no contributions when frequency is none", () => {
    const result = projectInvestment({
      ...baseInputs,
      contribution_frequency: "none",
      contribution_amount: 500,
    });
    assert.equal(result.totalContributions, 0);
  });
});

describe("projectSavingsGoal", () => {
  it("reaches the target amount within tolerance", () => {
    const target = 250_000;
    const result = projectSavingsGoal(
      { ...baseInputs, contribution_amount: 0 },
      target,
    );
    assert.ok(result.requiredContribution !== undefined);
    assert.ok(result.requiredContribution > 0);
    assert.ok(result.finalBalance >= target * 0.999);
  });

  it("returns zero required contribution when starting balance exceeds target", () => {
    const required = solveRequiredContribution(baseInputs, 5_000);
    assert.equal(required, 0);
  });
});

describe("projectTimeToGoal", () => {
  it("finds years to reach a target", () => {
    const result = projectTimeToGoal(
      { ...baseInputs, years: 0, contribution_amount: 500 },
      200_000,
    );
    assert.ok(result.requiredYears !== undefined);
    assert.ok(result.requiredYears > 0);
    assert.ok(result.finalBalance >= 200_000 * 0.999);
  });
});

describe("projectRequiredReturn", () => {
  it("finds growth rate to reach a target", () => {
    const result = projectRequiredReturn(
      { ...baseInputs, years: 20, annual_return_rate: 0 },
      500_000,
    );
    assert.ok(result.requiredReturnRate !== undefined);
    assert.ok(result.requiredReturnRate > 0);
    assert.ok(result.finalBalance >= 500_000 * 0.999);
  });
});

describe("projectInitialInvestment", () => {
  it("finds starting balance to reach a target", () => {
    const result = projectInitialInvestment(
      {
        ...baseInputs,
        starting_balance: 0,
        years: 15,
        contribution_amount: 300,
      },
      150_000,
    );
    assert.ok(result.requiredStartingBalance !== undefined);
    assert.ok(result.finalBalance >= 150_000 * 0.999);
  });
});

describe("doubling helpers", () => {
  it("computes doubling time and rule of 72", () => {
    assert.ok(doublingTimeYears(7) > 10 && doublingTimeYears(7) < 11);
    assert.ok(Math.abs(ruleOf72Years(7) - 10.29) < 0.1);
  });
});

describe("projectDoublingTime", () => {
  it("returns exact and rule-of-72 estimates", () => {
    const result = projectDoublingTime(10_000, 7);
    assert.ok(result.doublingTimeExact !== undefined);
    assert.ok(result.ruleOf72Estimate !== undefined);
    assert.equal(result.balanceAtDouble, 20_000);
    assert.ok(result.yearlyRows.length > 0);
  });
});

describe("projectWithdrawalDuration", () => {
  it("depletes balance with fixed monthly withdrawals", () => {
    const result = projectWithdrawalDuration(500_000, 3_000, 5);
    assert.ok(result.withdrawalDurationYears !== undefined);
    assert.ok(result.withdrawalDurationYears > 0);
    assert.equal(result.finalBalance, 0);
    assert.ok(result.totalWithdrawn !== undefined && result.totalWithdrawn > 0);
  });
});
