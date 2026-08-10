import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildDayHistoryVisual,
  buildTodaySummary,
  createChallenge,
  getDayScoreBand,
  incrementDayCount,
  setDayCount,
} from "./calculate";

describe("getDayScoreBand", () => {
  it("marks complete at or above target", () => {
    assert.equal(getDayScoreBand(100, 100), "complete");
    assert.equal(getDayScoreBand(120, 100), "complete");
  });

  it("marks partial between 50% and 99%", () => {
    assert.equal(getDayScoreBand(50, 100), "partial");
    assert.equal(getDayScoreBand(99, 100), "partial");
  });

  it("marks low below 50%", () => {
    assert.equal(getDayScoreBand(1, 100), "low");
    assert.equal(getDayScoreBand(49, 100), "low");
  });

  it("marks none at zero", () => {
    assert.equal(getDayScoreBand(0, 100), "none");
  });
});

describe("createChallenge", () => {
  it("requires a task name", () => {
    assert.throws(() => createChallenge({ taskName: "   " }), /Name your Rule of 100 task/);
  });

  it("defaults to a daily target of 100", () => {
    const challenge = createChallenge({
      taskName: "Message prospects",
      startDate: "2026-08-01",
    });

    assert.equal(challenge.dailyTarget, 100);
    assert.equal(challenge.taskName, "Message prospects");
    assert.equal(challenge.dayLogs[0]?.date, "2026-08-01");
  });
});

describe("incrementDayCount", () => {
  it("accumulates reps for the same day", () => {
    const challenge = createChallenge({
      taskName: "Write tweets",
      startDate: "2026-08-01",
    });

    const updated = incrementDayCount(
      incrementDayCount(challenge, "2026-08-01", 1),
      "2026-08-01",
      4,
    );

    assert.equal(setDayCount(challenge, "2026-08-01", 0).dayLogs[0]?.count, 0);
    assert.equal(updated.dayLogs.find((log) => log.date === "2026-08-01")?.count, 5);
  });
});

describe("buildDayHistoryVisual", () => {
  it("returns a line per day with score bands", () => {
    const challenge = incrementDayCount(
      createChallenge({ taskName: "Content minutes", startDate: "2026-08-01" }),
      "2026-08-01",
      100,
    );
    const withPartial = setDayCount(challenge, "2026-08-02", 60);

    const history = buildDayHistoryVisual(withPartial, "2026-08-02", 2);
    assert.equal(history.length, 2);
    assert.equal(history[0]?.band, "complete");
    assert.equal(history[1]?.band, "partial");
  });
});

describe("buildTodaySummary", () => {
  it("describes progress toward today's target", () => {
    const challenge = setDayCount(
      createChallenge({ taskName: "Outreach", startDate: "2026-08-03" }),
      "2026-08-03",
      25,
    );

    const summary = buildTodaySummary(challenge, "2026-08-03");
    assert.equal(summary.count, 25);
    assert.equal(summary.band, "low");
    assert.match(summary.message, /25 of 100/);
  });
});
