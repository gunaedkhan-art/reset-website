import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getTrackStatus } from "./calculate";
import { getSavingsPathRecoveryLinks } from "./recovery-links";
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
  checkIns: [{ date: "2026-06-01", amount: 2000 }],
};

describe("getSavingsPathRecoveryLinks", () => {
  it("returns empty when on track", () => {
    const onTrackPlan: SavingsPathPlan = {
      ...basePlan,
      checkIns: [{ date: "2026-06-01", amount: 9000 }],
    };
    const status = getTrackStatus(onTrackPlan.goal, onTrackPlan.checkIns, "2026-06-15");
    assert.equal(getSavingsPathRecoveryLinks(onTrackPlan, status, "2026-06-15").length, 0);
  });

  it("returns empty before the first check-in", () => {
    const status = getTrackStatus(basePlan.goal, [], "2026-06-15");
    assert.equal(getSavingsPathRecoveryLinks(basePlan, status, "2026-06-15").length, 0);
  });

  it("suggests savings goal calculator when behind", () => {
    const status = getTrackStatus(basePlan.goal, basePlan.checkIns, "2026-06-15");
    const links = getSavingsPathRecoveryLinks(basePlan, status, "2026-06-15");

    assert.equal(links.length, 2);
    assert.equal(links[0]?.slug, "savings-goal-calculator");
  });

  it("omits growth calculator when the target date is near", () => {
    const nearPlan: SavingsPathPlan = {
      ...basePlan,
      goal: { ...basePlan.goal, targetDate: "2026-08-01" },
    };
    const status = getTrackStatus(nearPlan.goal, nearPlan.checkIns, "2026-06-15");
    const links = getSavingsPathRecoveryLinks(nearPlan, status, "2026-06-15");

    assert.equal(links.length, 1);
    assert.equal(links[0]?.slug, "savings-goal-calculator");
  });
});
