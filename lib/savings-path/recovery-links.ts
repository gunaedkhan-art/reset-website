import { parseIsoDate, todayIsoDate } from "./format";
import {
  buildInvestmentGrowthCalculatorUrl,
  buildSavingsGoalCalculatorUrl,
} from "./prefill";
import type { SavingsPathPlan, TrackStatus } from "./types";

export interface SavingsRecoveryLink {
  slug: string;
  title: string;
  description: string;
  href: string;
}

const MIN_DAYS_FOR_GROWTH_LINK = 180;

function daysUntilTarget(targetDate: string, asOfDate: string): number {
  const start = parseIsoDate(asOfDate);
  const end = parseIsoDate(targetDate);
  return Math.max(
    0,
    Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)),
  );
}

/** Suggest money-cluster tools when the user falls below their savings path. */
export function getSavingsPathRecoveryLinks(
  plan: SavingsPathPlan,
  status: TrackStatus,
  asOfDate?: string,
): SavingsRecoveryLink[] {
  if (status.onTrack || plan.checkIns.length === 0) return [];

  const today = asOfDate ?? todayIsoDate();
  const links: SavingsRecoveryLink[] = [
    {
      slug: "savings-goal-calculator",
      title: "Recalculate monthly savings",
      description:
        "You're below the line — see the contribution needed to still hit your target date.",
      href: buildSavingsGoalCalculatorUrl(plan, today),
    },
  ];

  if (daysUntilTarget(plan.goal.targetDate, today) >= MIN_DAYS_FOR_GROWTH_LINK) {
    links.push({
      slug: "investment-growth-calculator",
      title: "Project growth on contributions",
      description:
        "With months still on the clock, model whether investing could help close the gap.",
      href: buildInvestmentGrowthCalculatorUrl(plan, today),
    });
  }

  return links;
}
