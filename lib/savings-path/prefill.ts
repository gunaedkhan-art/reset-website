import { getTrackStatus } from "./calculate";
import { parseIsoDate, todayIsoDate } from "./format";
import type { SavingsPathPlan } from "./types";

export interface SavingsPathCalculatorPrefill {
  target_amount: string;
  starting_balance: string;
  years: string;
}

const PREFILL_PARAM_KEYS = [
  "target_amount",
  "starting_balance",
  "years",
  "annual_return_rate",
  "contribution_amount",
  "contribution_frequency",
  "contribution_timing",
] as const;

function daysUntilTarget(targetDate: string, asOfDate: string): number {
  const start = parseIsoDate(asOfDate);
  const end = parseIsoDate(targetDate);
  return Math.max(
    0,
    Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)),
  );
}

function yearsUntilTarget(targetDate: string, asOfDate: string): number {
  const years = daysUntilTarget(targetDate, asOfDate) / 365.25;
  return Math.max(0.25, Math.round(years * 4) / 4);
}

export function buildSavingsPathCalculatorPrefill(
  plan: SavingsPathPlan,
  asOfDate?: string,
): SavingsPathCalculatorPrefill {
  const today = asOfDate ?? todayIsoDate();
  const status = getTrackStatus(plan.goal, plan.checkIns, today);

  return {
    target_amount: String(Math.round(plan.goal.targetAmount)),
    starting_balance: String(Math.round(status.actualAmount)),
    years: String(yearsUntilTarget(plan.goal.targetDate, today)),
  };
}

function appendPrefillParams(
  basePath: string,
  prefill: Partial<SavingsPathCalculatorPrefill>,
  options?: { includeTarget?: boolean },
): string {
  const params = new URLSearchParams();
  if (options?.includeTarget !== false && prefill.target_amount) {
    params.set("target_amount", prefill.target_amount);
  }
  if (prefill.starting_balance) {
    params.set("starting_balance", prefill.starting_balance);
  }
  if (prefill.years) {
    params.set("years", prefill.years);
  }
  params.set("source", "savings-path");
  return `${basePath}?${params.toString()}`;
}

export function buildSavingsGoalCalculatorUrl(
  plan: SavingsPathPlan,
  asOfDate?: string,
): string {
  const prefill = buildSavingsPathCalculatorPrefill(plan, asOfDate);
  return appendPrefillParams("/savings-goal-calculator", prefill);
}

export function buildInvestmentGrowthCalculatorUrl(
  plan: SavingsPathPlan,
  asOfDate?: string,
): string {
  const prefill = buildSavingsPathCalculatorPrefill(plan, asOfDate);
  return appendPrefillParams("/investment-growth-calculator", prefill, {
    includeTarget: false,
  });
}

export function parseInvestmentPrefillFromSearchParams(
  params: URLSearchParams,
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const key of PREFILL_PARAM_KEYS) {
    const value = params.get(key)?.trim();
    if (value) result[key] = value;
  }
  return result;
}

export function isSavingsPathCalculatorPrefill(
  params: URLSearchParams,
): boolean {
  return params.get("source") === "savings-path";
}
