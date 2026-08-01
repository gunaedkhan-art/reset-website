import {
  buildBalanceHistoryRows,
  getTrackStatus,
} from "./calculate";
import { formatChartDate, formatCurrency, todayIsoDate } from "./format";
import type { SavingsPathPlan } from "./types";

export function buildSavingsPathExportText(
  plan: SavingsPathPlan,
  asOfDate?: string,
): string {
  const today = asOfDate ?? todayIsoDate();
  const { goal, checkIns } = plan;
  const status = getTrackStatus(goal, checkIns, today);
  const currency = goal.currency;
  const lines = [
    `Savings Path — ${formatChartDate(goal.startDate)} to ${formatChartDate(goal.targetDate)}`,
    "",
    `Target: ${formatCurrency(goal.targetAmount, currency)}`,
    `Latest balance: ${formatCurrency(status.actualAmount, currency)} (${formatChartDate(status.referenceDate)})`,
    `Expected on path: ${formatCurrency(status.expectedAmount, currency)}`,
    `Status: ${status.onTrack ? "On track" : "Below target path"}`,
  ];

  const updates = buildBalanceHistoryRows(goal, checkIns).filter(
    (row) => row.kind === "update",
  );

  if (updates.length > 0) {
    lines.push("", "Check-ins:");
    for (const row of updates) {
      lines.push(
        `- ${formatChartDate(row.date)}: ${formatCurrency(row.amount, currency)}`,
      );
    }
  }

  return lines.join("\n");
}

export function buildSavingsPathShareTitle(plan: SavingsPathPlan): string {
  return `Savings Path — ${formatChartDate(plan.goal.startDate)} to ${formatChartDate(plan.goal.targetDate)}`;
}
