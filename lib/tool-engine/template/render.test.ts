import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { renderTemplate } from "./render";
import type { TemplateContext } from "./render";

const ctx: TemplateContext = {
  inputs: { salary: 75000 },
  scores: {},
  calcs: { hourlyRate: 36.057692, moneyLost: 180.288 },
  constants: {},
  answers: {},
};

describe("renderTemplate", () => {
  it("renders plain paths", () => {
    assert.equal(renderTemplate("Rate: {{calcs.hourlyRate}}", ctx), "Rate: 36.1");
  });

  it("formats currency", () => {
    assert.equal(
      renderTemplate("{{calcs.moneyLost|currency}}", ctx),
      "$180",
    );
  });

  it("formats currencyPrecise", () => {
    assert.equal(
      renderTemplate("{{calcs.hourlyRate|currencyPrecise}}", ctx),
      "$36.06",
    );
  });

  it("formats decimal1", () => {
    assert.equal(renderTemplate("{{calcs.hourlyRate|decimal1}}", ctx), "36.1");
  });
});
