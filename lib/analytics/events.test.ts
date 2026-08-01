import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { analyticsEventParams } from "./events";

describe("analyticsEventParams", () => {
  it("maps cluster journey step clicks", () => {
    const params = analyticsEventParams({
      name: "cluster_journey_step_click",
      hub_slug: "phone-and-focus",
      tool_slug: "meeting-cost-calculator",
      step_number: "7",
      optional: "true",
    });

    assert.equal(params.event, "cluster_journey_step_click");
    assert.equal(params.hub_slug, "phone-and-focus");
    assert.equal(params.optional, "true");
  });

  it("maps weekly copy summary export", () => {
    const params = analyticsEventParams({
      name: "one_thing_weekly_copy_summary",
      tool_slug: "one-thing-weekly-check-in",
      includes_trends: "true",
    });

    assert.equal(params.event, "one_thing_weekly_copy_summary");
    assert.equal(params.includes_trends, "true");
  });
});
