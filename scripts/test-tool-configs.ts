#!/usr/bin/env npx tsx
/**
 * Smoke-tests each published tool config through a minimal happy path.
 * Run: npm run test:tool-configs
 */
import assert from "node:assert/strict";
import { toolConfigManifest } from "../lib/tool-engine/compiler/manifest";
import { runCalculatorFlow } from "../lib/tool-engine/modes/calculator";
import {
  answerQuestion,
  createDecisionTreeState,
} from "../lib/tool-engine/modes/decision-tree";
import { evaluateCondition } from "../lib/tool-engine/expression/evaluate";
import { buildInvestmentInputDefaults } from "../tools/config/investment-shared";
import { parseInvestmentInputs, runCalculatorProfile } from "../lib/investment/profiles";
import {
  evaluateComparisonRules,
  renderTemplate,
  type TemplateContext,
} from "../lib/tool-engine/template/render";

let passed = 0;
let failed = 0;

function test(name: string, fn: () => void) {
  try {
    fn();
    passed++;
    console.log(`  ✔ ${name}`);
  } catch (error) {
    failed++;
    console.error(`  ✖ ${name}`);
    console.error(`    ${error instanceof Error ? error.message : error}`);
  }
}

for (const config of toolConfigManifest.filter((c) => c.status === "published")) {
  console.log(`\n${config.slug}`);

  if (config.mode === "calculator" && config.flow.type === "calculator") {
    const flow = config.flow;
    if (flow.engine === "savings-path" || flow.engine === "one-thing-weekly") {
      test(`${flow.engine} config is registered`, () => {
        assert.equal(config.mode, "calculator");
        assert.ok(config.results.emptyMessage);
        assert.ok(config.results.templates.length > 0);
      });
      continue;
    }

    if (flow.engine === "projection" && flow.calculatorProfile) {
      test("projection calculator runs with default inputs", () => {
        const raw = buildInvestmentInputDefaults(flow.inputs);
        const fieldIds = flow.inputs.map((field) => field.id);
        const parsed = parseInvestmentInputs(raw, fieldIds);
        const projection = runCalculatorProfile(flow.calculatorProfile!, parsed);

        const ctx: TemplateContext = {
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
          constants: flow.constants ?? {},
          answers: {},
          projection,
        };

        const template = config.results.templates.find(
          (t) => t.id === flow.resultTemplateId,
        );
        assert.ok(template, `Missing result template: ${flow.resultTemplateId}`);

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
      });
      continue;
    }

    test("calculator runs with sample inputs", () => {
      const inputs: Record<string, string> = {};
      for (const field of flow.inputs) {
        if (field.max !== undefined && field.min !== undefined) {
          inputs[field.id] = String(
            field.integer ? Math.floor((field.min + field.max) / 2) : (field.min + field.max) / 2,
          );
        } else if (field.min !== undefined) {
          inputs[field.id] = String(field.min + (field.integer ? 1 : 0.5));
        } else {
          inputs[field.id] = field.integer ? "10" : "10";
        }
      }

      const result = runCalculatorFlow(flow, inputs);
      assert.ok(Object.keys(result.context.calcs).length > 0);
      assert.equal(result.resultTemplateId, flow.resultTemplateId);
    });
  }

  if (config.mode === "decision-tree" && config.flow.type === "decision-tree") {
    const flow = config.flow;
    test("decision tree completes via first options", () => {
      let state = createDecisionTreeState(flow);
      let guard = 0;

      while (!state.complete && guard < 20) {
        const node = flow.nodes[state.currentNodeId];
        assert.ok(node, `Unknown node: ${state.currentNodeId}`);

        if (node.type === "question") {
          state = answerQuestion(flow, state, node.options[0]!.id);
        } else {
          break;
        }
        guard++;
      }

      assert.equal(state.complete, true, "Tree did not reach a result node");
      assert.ok(state.resultTemplateId, "Missing result template id");
      const template = config.results.templates.find(
        (t) => t.id === state.resultTemplateId,
      );
      assert.ok(template, `Unknown result template: ${state.resultTemplateId}`);
    });

    test("branch conditions evaluate without error", () => {
      for (const node of Object.values(flow.nodes)) {
        if (node.type !== "branch") continue;
        for (const condition of node.conditions) {
          evaluateCondition(condition.when, {
            inputs: {},
            scores: {},
            calcs: {},
            constants: {},
          });
        }
      }
    });
  }
}

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
