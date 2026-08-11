import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getTodayCount, setDayCount, createChallenge } from "./calculate";
import { RULE_OF_100_STORAGE_KEY } from "./types";

describe("rule of 100 storage key", () => {
  it("uses a stable localStorage key", () => {
    assert.equal(RULE_OF_100_STORAGE_KEY, "reset-rule-of-100-v1");
  });
});

describe("saved count roundtrip", () => {
  it("persists day counts on a challenge object", () => {
    const challenge = setDayCount(
      createChallenge({ taskName: "Outreach", startDate: "2026-08-11" }),
      "2026-08-11",
      42,
    );

    assert.equal(getTodayCount(challenge, "2026-08-11"), 42);
    assert.equal(
      getTodayCount(JSON.parse(JSON.stringify(challenge)), "2026-08-11"),
      42,
    );
  });
});
