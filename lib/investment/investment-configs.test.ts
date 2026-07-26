import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { evaluateCondition } from "@/lib/tool-engine/expression/evaluate";
import {
  evaluateComparisonRules,
  renderTemplate,
  type TemplateContext,
} from "@/lib/tool-engine/template/render";
import { toolConfigManifest } from "@/lib/tool-engine/compiler/manifest";
import type { ToolConfig } from "@/lib/tool-engine/schema/tool-config";
import { buildInvestmentInputDefaults } from "@/tools/config/investment-shared";
import { parseInvestmentInputs, runCalculatorProfile } from "./profiles";

const INVESTMENT_SLUGS = [
  "compound-growth-calculator",
  "investment-growth-calculator",
  "savings-goal-calculator",
  "investment-time-calculator",
  "required-return-calculator",
  "initial-investment-calculator",
  "investment-doubling-calculator",
  "investment-withdrawal-calculator",
] as const;

function getInvestmentConfigs(): ToolConfig[] {
  return toolConfigManifest.filter((config) =>
    INVESTMENT_SLUGS.includes(config.slug as (typeof INVESTMENT_SLUGS)[number]),
  );
}

function buildContext(
  config: ToolConfig,
  raw: Record<string, string>,
): TemplateContext {
  if (config.flow.type !== "calculator" || config.flow.engine !== "projection") {
    throw new Error(`${config.slug} is not a projection calculator`);
  }

  const fieldIds = config.flow.inputs.map((field) => field.id);
  const parsed = parseInvestmentInputs(raw, fieldIds);
  const projection = runCalculatorProfile(config.flow.calculatorProfile!, parsed);

  return {
    inputs: {
      starting_balance: parsed.starting_balance,
      target_amount: parsed.target_amount ?? 0,
      annual_return_rate: parsed.annual_return_rate,
      years: parsed.years,
      contribution_amount: parsed.contribution_amount,
      contribution_frequency: parsed.contribution_frequency,
      contribution_timing: parsed.contribution_timing,
      compounding_frequency: parsed.compounding_frequency,
      withdrawal_amount: parsed.withdrawal_amount ?? 0,
    },
    scores: {},
    calcs: {},
    constants: config.flow.constants ?? {},
    answers: {},
    projection,
  };
}

function renderConfigResults(config: ToolConfig, ctx: TemplateContext): void {
  const flow = config.flow;
  if (flow.type !== "calculator") return;

  const template = config.results.templates.find((t) => t.id === flow.resultTemplateId);
  assert.ok(template, `${config.slug}: missing result template ${flow.resultTemplateId}`);

  for (const card of template.cards ?? []) {
    renderTemplate(card.valueTemplate, ctx);
    if (card.descriptionTemplate) {
      renderTemplate(card.descriptionTemplate, ctx);
    }
  }

  for (const line of template.summaryTemplates ?? []) {
    renderTemplate(line, ctx);
  }

  evaluateComparisonRules(
    template.comparisonRules ?? [],
    ctx,
    template.fallbackComparison,
  );
}

describe("investment calculator configs", () => {
  for (const config of getInvestmentConfigs()) {
    describe(config.slug, () => {
      it("runs with default inputs and renders all result templates", () => {
        if (config.flow.type !== "calculator" || config.flow.engine !== "projection") {
          throw new Error("Expected projection calculator flow");
        }

        const raw = buildInvestmentInputDefaults(config.flow.inputs);
        const ctx = buildContext(config, raw);
        renderConfigResults(config, ctx);
      });

      it("evaluates every comparison rule without expression errors", () => {
        if (config.flow.type !== "calculator" || config.flow.engine !== "projection") {
          throw new Error("Expected projection calculator flow");
        }

        const template = config.results.templates.find(
          (t) => t.id === config.flow.resultTemplateId,
        );
        const raw = buildInvestmentInputDefaults(config.flow.inputs);
        const ctx = buildContext(config, raw);

        for (const rule of template?.comparisonRules ?? []) {
          if (rule.when !== "true") {
            evaluateCondition(rule.when, ctx);
          }
        }
      });
    });
  }
});
