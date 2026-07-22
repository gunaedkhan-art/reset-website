import type { CalculatorFlow } from "../schema/tool-config";
import type { EvalContext } from "../expression/evaluate";
import { runExpressions } from "../expression/evaluate";

export interface CalculatorInputValues {
  [key: string]: number | string;
}

export interface CalculatorRunResult {
  context: EvalContext;
  resultTemplateId: string;
}

export function runCalculatorFlow(
  flow: CalculatorFlow,
  rawInputs: CalculatorInputValues,
): CalculatorRunResult {
  const inputs: Record<string, number | string | boolean> = {};
  const constants = flow.constants ?? {};

  for (const field of flow.inputs) {
    const raw = rawInputs[field.id];

    if (raw === undefined || raw === "") {
      throw new Error(`Missing input: ${field.id}`);
    }

    if (field.type === "number" || field.type === "integer") {
      const parsed =
        typeof raw === "number" ? raw : Number.parseFloat(String(raw));

      if (Number.isNaN(parsed)) {
        throw new Error(`Invalid number for ${field.id}`);
      }

      if (field.integer && !Number.isInteger(parsed)) {
        throw new Error(`${field.label} must be a whole number`);
      }

      if (field.min !== undefined && parsed < field.min) {
        throw new Error(`${field.label} must be at least ${field.min}`);
      }

      if (field.max !== undefined && parsed > field.max) {
        throw new Error(`${field.label} must be at most ${field.max}`);
      }

      inputs[field.id] = parsed;
    } else {
      inputs[field.id] = String(raw);
    }
  }

  const baseContext: EvalContext = {
    inputs,
    scores: {},
    calcs: {},
    constants,
  };

  const calcs = runExpressions(flow.expressions, baseContext);

  return {
    context: { ...baseContext, calcs },
    resultTemplateId: flow.resultTemplateId,
  };
}
