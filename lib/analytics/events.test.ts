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

  it("maps weekly share summary", () => {
    const params = analyticsEventParams({
      name: "one_thing_weekly_share_summary",
      tool_slug: "one-thing-weekly-check-in",
      method: "native",
      includes_trends: "false",
    });

    assert.equal(params.event, "one_thing_weekly_share_summary");
    assert.equal(params.method, "native");
  });

  it("maps hub pillar and tracker continue clicks", () => {
    assert.equal(
      analyticsEventParams({
        name: "cluster_hub_pillar_click",
        hub_slug: "one-thing",
        tool_slug: "the-focusing-question",
      }).event,
      "cluster_hub_pillar_click",
    );
    assert.equal(
      analyticsEventParams({
        name: "tracker_continue_click",
        tracker_kind: "one-thing-weekly",
      }).tracker_kind,
      "one-thing-weekly",
    );
  });
});
