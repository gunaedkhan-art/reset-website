export type ContributionFrequency = "none" | "monthly" | "quarterly" | "annually";

export type ContributionTiming = "beginning" | "end";

export type CompoundingFrequency = "daily" | "monthly" | "quarterly" | "annually";

export type CalculatorProfile =
  | "future-value"
  | "compound-growth"
  | "savings-goal"
  | "time-to-goal"
  | "required-return"
  | "initial-investment"
  | "doubling-time"
  | "withdrawal-duration";

export interface InvestmentInputs {
  starting_balance: number;
  target_amount?: number;
  annual_return_rate: number;
  years: number;
  contribution_amount: number;
  contribution_frequency: ContributionFrequency;
  contribution_timing: ContributionTiming;
  compounding_frequency: CompoundingFrequency;
  withdrawal_amount?: number;
}

export interface YearlyProjectionRow {
  year: number;
  balance: number;
  contributionsThisYear: number;
  growthThisYear: number;
  cumulativeContributions: number;
  cumulativeGrowth: number;
  withdrawalsThisYear?: number;
  cumulativeWithdrawals?: number;
}

export interface ProjectionResult {
  finalBalance: number;
  totalContributions: number;
  totalGrowth: number;
  growthFromStartingBalance: number;
  growthFromContributions: number;
  requiredContribution?: number;
  requiredYears?: number;
  requiredReturnRate?: number;
  requiredStartingBalance?: number;
  doublingTimeExact?: number;
  ruleOf72Estimate?: number;
  ruleOf72Difference?: number;
  balanceAtDouble?: number;
  withdrawalDurationYears?: number;
  totalWithdrawn?: number;
  effectiveAnnualGrowthRate: number;
  yearlyRows: YearlyProjectionRow[];
}

export const INVESTMENT_CALCULATOR_DISCLAIMER =
  "This calculator provides estimates for educational purposes only. It is not investment advice, tax advice, or a recommendation to buy or sell any security. Past growth rates do not guarantee future results.";
