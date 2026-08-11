import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildSavingsPathExportText } from "./export";
import { buildSavingsPathShareMailtoUrl } from "./share";
import type { SavingsPathPlan } from "./types";

const samplePlan: SavingsPathPlan = {
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

describe("buildSavingsPathExportText", () => {
  it("includes target, balance, and check-ins", () => {
    const text = buildSavingsPathExportText(samplePlan, "2026-06-15");

    assert.match(text, /Target: \$10,000/);
    assert.match(text, /Latest balance: \$4,500/);
    assert.match(text, /Check-ins:/);
    assert.match(text, /Jun 1: \$4,500/);
  });
});

describe("buildSavingsPathShareMailtoUrl", () => {
  it("builds a mailto link", () => {
    const url = buildSavingsPathShareMailtoUrl({
      exportText: "Status: On track",
      title: "Savings Path — Jan 1 to Jan 1, 2027",
      trackerUrl: "https://resetgoals.com/savings-path-tracker",
    });

    assert.match(url, /^mailto:\?subject=/);
    assert.match(decodeURIComponent(url), /Status: On track/);
  });
});
