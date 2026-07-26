import type { InputField } from "@/lib/tool-engine/schema/tool-config";

export const INVESTMENT_DISCLAIMER =
  "This calculator provides estimates for educational purposes only. It is not investment advice, tax advice, or a recommendation to buy or sell any security. Past growth rates do not guarantee future results.";

/** App download copy when `siteConfig.features.showAppDownload` is enabled. */
export const INVESTMENT_APP_CTA = {
  title: "Set financial goals in Reset",
  description:
    "Track savings targets, review progress, and stay on plan — without distraction pulling you off course.",
} as const;

/**
 * Visible goals CTA on investment tool pages while app download is hidden globally.
 * Primary action routes to the savings-goal calculator.
 */
export const INVESTMENT_GOALS_CTA = {
  title: "Turn this estimate into a goal",
  description:
    "Pick a target amount and timeline, then work backwards to a monthly savings plan you can stick to.",
  primaryLabel: "Set a savings goal",
  primaryHref: "/savings-goal-calculator",
} as const;

/** Goals CTA for the savings-goal calculator itself (next step in the cluster). */
export const SAVINGS_GOAL_NEXT_CTA = {
  title: "See how your goal fits your timeline",
  description:
    "You have a monthly target — check whether your timeline and growth assumptions still line up.",
  primaryLabel: "Calculate time to goal",
  primaryHref: "/investment-time-calculator",
  secondaryLabel: "Project full growth",
  secondaryHref: "/investment-growth-calculator",
} as const;

export const contributionFrequencyOptions = [
  { value: "none", label: "No contributions" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "annually", label: "Annually" },
] as const;

export const contributionTimingOptions = [
  { value: "end", label: "End of each period" },
  { value: "beginning", label: "Beginning of each period" },
] as const;

export const compoundingFrequencyOptions = [
  { value: "daily", label: "Daily" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "annually", label: "Annually" },
] as const;

export function buildInvestmentInputDefaults(
  fields: InputField[],
): Record<string, string> {
  return Object.fromEntries(
    fields.map((field) => [field.id, field.defaultValue ?? ""]),
  );
}

export const sharedInvestmentFields = {
  startingBalance: {
    id: "starting_balance",
    type: "number" as const,
    label: "Starting balance",
    placeholder: "e.g. 10000",
    hint: "Amount already saved or invested today.",
    min: 0,
    step: 100,
    defaultValue: "10000",
  },
  targetAmount: {
    id: "target_amount",
    type: "number" as const,
    label: "Target amount",
    placeholder: "e.g. 250000",
    hint: "The balance you want to reach.",
    min: 0,
    step: 1000,
    defaultValue: "250000",
  },
  annualReturnRate: {
    id: "annual_return_rate",
    type: "number" as const,
    label: "Expected annual growth rate (%)",
    placeholder: "e.g. 7",
    hint: "Nominal annual return assumption — not a guarantee.",
    min: 0,
    max: 100,
    step: 0.1,
    defaultValue: "7",
  },
  years: {
    id: "years",
    type: "number" as const,
    label: "Years to grow",
    placeholder: "e.g. 20",
    hint: "How long the money stays invested.",
    min: 0.25,
    max: 100,
    step: 0.25,
    defaultValue: "20",
  },
  contributionAmount: {
    id: "contribution_amount",
    type: "number" as const,
    label: "Contribution amount",
    placeholder: "e.g. 500",
    hint: "Amount added each contribution period.",
    min: 0,
    step: 10,
    defaultValue: "500",
  },
  contributionFrequency: {
    id: "contribution_frequency",
    type: "select" as const,
    label: "Contribution schedule",
    hint: "How often you add money.",
    defaultValue: "monthly",
    options: [...contributionFrequencyOptions],
  },
  contributionTiming: {
    id: "contribution_timing",
    type: "select" as const,
    label: "Contribution timing",
    hint: "Whether each contribution is added at the start or end of the period.",
    defaultValue: "end",
    options: [...contributionTimingOptions],
  },
  compoundingFrequency: {
    id: "compounding_frequency",
    type: "select" as const,
    label: "Compounding schedule",
    hint: "How often earnings are reinvested and compounded.",
    defaultValue: "monthly",
    options: [...compoundingFrequencyOptions],
  },
  withdrawalAmount: {
    id: "withdrawal_amount",
    type: "number" as const,
    label: "Monthly withdrawal",
    placeholder: "e.g. 2000",
    hint: "Fixed amount withdrawn each month.",
    min: 0,
    step: 50,
    defaultValue: "2000",
  },
};
