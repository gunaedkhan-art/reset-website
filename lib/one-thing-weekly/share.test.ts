import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildWeeklyShareMailtoUrl,
  buildWeeklyShareText,
  buildWeeklyShareTitle,
} from "./share";

describe("buildWeeklyShareTitle", () => {
  it("includes the week label", () => {
    assert.equal(
      buildWeeklyShareTitle("28 Jul – 3 Aug 2026"),
      "ONE Thing Weekly — 28 Jul – 3 Aug 2026",
    );
  });
});

describe("buildWeeklyShareText", () => {
  it("appends tracker link footer", () => {
    const text = buildWeeklyShareText({
      exportText: "ONE Thing: Write",
      weekLabel: "28 Jul – 3 Aug 2026",
      trackerUrl: "https://resetgoals.com/one-thing-weekly-check-in",
    });

    assert.match(text, /ONE Thing: Write/);
    assert.match(text, /Track your week: https:\/\/resetgoals.com/);
  });
});

describe("buildWeeklyShareMailtoUrl", () => {
  it("builds a mailto link with subject and body", () => {
    const url = buildWeeklyShareMailtoUrl({
      exportText: "Week score: 80%",
      weekLabel: "28 Jul – 3 Aug 2026",
      trackerUrl: "https://resetgoals.com/one-thing-weekly-check-in",
    });

    assert.match(url, /^mailto:\?subject=/);
    assert.match(url, /body=/);
    assert.match(decodeURIComponent(url), /Week score: 80%/);
  });

  it("truncates very long bodies for mailto clients", () => {
    const url = buildWeeklyShareMailtoUrl({
      exportText: "x".repeat(2000),
      weekLabel: "This week",
      trackerUrl: "https://resetgoals.com/one-thing-weekly-check-in",
    });

    const decoded = decodeURIComponent(url);
    assert.match(decoded, /\(truncated\)/);
    assert.ok(decoded.length < 2200);
  });
});
