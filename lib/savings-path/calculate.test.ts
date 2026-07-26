import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildChartModel,
  buildProgressLine,
  expectedAmountAtDate,
  getTrackStatus,
  parseSavingsPathInput,
} from "./calculate";

const goal = {
  targetAmount: 10_000,
  targetDate: "2026-12-31",
  startAmount: 1_000,
  startDate: "2026-01-01",
  currency: "USD" as const,
};

describe("expectedAmountAtDate", () => {
  it("returns start amount on start date", () => {
    assert.equal(expectedAmountAtDate(goal, "2026-01-01"), 1_000);
  });

  it("returns target amount on target date", () => {
    assert.equal(expectedAmountAtDate(goal, "2026-12-31"), 10_000);
  });

  it("interpolates linearly at midpoint", () => {
    const mid = expectedAmountAtDate(goal, "2026-07-02");
    assert.ok(Math.abs(mid - 5_500) < 250);
  });
});

describe("buildProgressLine", () => {
  it("starts at the goal start point and includes check-ins", () => {
    const line = buildProgressLine(goal, [
      { id: "1", amount: 2_500, date: "2026-04-01" },
      { id: "2", amount: 4_000, date: "2026-08-01" },
    ]);

    assert.equal(line[0]?.date, "2026-01-01");
    assert.equal(line[0]?.amount, 1_000);
    assert.equal(line.at(-1)?.amount, 4_000);
  });
});

describe("getTrackStatus", () => {
  it("marks ahead when balance exceeds the target path", () => {
    const status = getTrackStatus(
      goal,
      [{ id: "1", amount: 6_000, date: "2026-07-01" }],
      "2026-07-01",
    );

    assert.equal(status.onTrack, true);
    assert.ok(status.gap > 0);
  });

  it("marks behind when balance is below the target path", () => {
    const status = getTrackStatus(
      goal,
      [{ id: "1", amount: 2_000, date: "2026-07-01" }],
      "2026-07-01",
    );

    assert.equal(status.onTrack, false);
    assert.ok(status.gap < 0);
  });
});

describe("buildChartModel", () => {
  it("includes income markers within the plan window", () => {
    const model = buildChartModel({
      goal,
      incomeSources: [
        { id: "inc-1", amount: 500, date: "2026-03-15", label: "Payday" },
      ],
      checkIns: [],
    });

    assert.equal(model.incomeMarkers.length, 1);
    assert.equal(model.incomeMarkers[0]?.label, "Payday");
  });
});

describe("parseSavingsPathInput", () => {
  it("validates target exceeds start", () => {
    assert.throws(
      () =>
        parseSavingsPathInput({
          targetAmount: "500",
          targetDate: "2026-12-31",
          startAmount: "1000",
          startDate: "2026-01-01",
          currency: "USD",
        }),
      /Target amount must be higher/,
    );
  });
});
