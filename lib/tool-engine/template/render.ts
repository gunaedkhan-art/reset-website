import type { EvalContext } from "../expression/evaluate";
import { evaluateCondition } from "../expression/evaluate";

export interface TemplateContext extends EvalContext {
  answers: Record<string, string | string[]>;
}

export function renderTemplate(
  template: string,
  ctx: TemplateContext,
): string {
  return template.replace(/\{\{\s*([^}]+)\s*\}\}/g, (_, rawPath: string) => {
    const [path, format] = rawPath.trim().split("|").map((part) => part.trim());
    const value = resolveTemplatePath(path!, ctx);
    return formatTemplateValue(value, format);
  });
}

function resolveTemplatePath(path: string, ctx: TemplateContext): unknown {
  const [scope, key] = path.split(".");
  if (!key) return path;

  switch (scope) {
    case "inputs":
      return ctx.inputs[key];
    case "scores":
      return ctx.scores[key];
    case "calcs":
      return ctx.calcs[key];
    case "constants":
      return ctx.constants[key];
    case "answers":
      return ctx.answers[key];
    default:
      return undefined;
  }
}

function formatTemplateValue(value: unknown, format?: string): string {
  if (value === undefined || value === null) return "";

  if (typeof value === "number") {
    switch (format) {
      case "currency":
        return value.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 0,
          minimumFractionDigits: 0,
        });
      case "currencyPrecise":
        return value.toLocaleString("en-US", {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 2,
          minimumFractionDigits: 2,
        });
      case "integer":
        return Math.floor(value).toLocaleString("en-US");
      case "decimal1":
        return value.toLocaleString("en-US", {
          maximumFractionDigits: 1,
          minimumFractionDigits: value < 10 ? 1 : 0,
        });
      default:
        if (Number.isInteger(value)) {
          return value.toLocaleString("en-US");
        }
        return value.toLocaleString("en-US", { maximumFractionDigits: 1 });
    }
  }

  if (Array.isArray(value)) return value.join(", ");
  return String(value);
}

export function evaluateComparisonRules(
  rules: { when: string; textTemplate: string }[],
  ctx: TemplateContext,
  fallback?: string,
  max = 5,
): string[] {
  const results: string[] = [];

  for (const rule of rules) {
    if (results.length >= max) break;
    if (rule.when === "true" || evaluateCondition(rule.when, ctx)) {
      results.push(renderTemplate(rule.textTemplate, ctx));
    }
  }

  if (results.length === 0 && fallback) {
    results.push(renderTemplate(fallback, ctx));
  }

  return results.slice(0, max);
}

export function evaluateRecommendationRules(
  rules: { when: string; steps?: string[]; title?: string }[],
  ctx: TemplateContext,
): { title?: string; steps: string[] } | null {
  for (const rule of rules) {
    if (evaluateCondition(rule.when, ctx)) {
      return {
        title: rule.title ? renderTemplate(rule.title, ctx) : undefined,
        steps: (rule.steps ?? []).map((step) => renderTemplate(step, ctx)),
      };
    }
  }
  return null;
}
