import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getClusterJourney,
  isRepeatUseTool,
} from "./cluster-journeys";

describe("getClusterJourney", () => {
  it("returns the ONE Thing path", () => {
    const journey = getClusterJourney("one-thing");
    assert.ok(journey);
    assert.equal(journey.steps[0]?.slug, "weekly-planning-score");
    assert.equal(journey.steps.at(-1)?.slug, "four-thieves-productivity-quiz");
  });

  it("returns undefined for unknown hubs", () => {
    assert.equal(getClusterJourney("unknown"), undefined);
  });
});

describe("isRepeatUseTool", () => {
  it("flags repeat-use trackers", () => {
    assert.equal(isRepeatUseTool("one-thing-weekly-check-in"), true);
    assert.equal(isRepeatUseTool("the-focusing-question"), false);
  });
});
