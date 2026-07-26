import {
  compoundLumpSumGrowth,
  projectDoublingTime,
  projectInitialInvestment,
  projectInvestment,
  projectRequiredReturn,
  projectSavingsGoal,
  projectTimeToGoal,
  projectWithdrawalDuration,
} from "./simulate";
import type {
  CalculatorProfile,
  ContributionFrequency,
  ContributionTiming,
  CompoundingFrequency,
  InvestmentInputs,
  ProjectionResult,
} from "./types";

export interface RawInvestmentFormValues {
  [key: string]: string;
}

export function parseInvestmentInputs(
  raw: RawInvestmentFormValues,
  fieldIds: string[],
): InvestmentInputs {
  const getNumber = (id: string): number => {
    const value = raw[id];
    if (value === undefined || value === "") {
      throw new Error(`Missing input: ${id}`);
    }
    const parsed = Number.parseFloat(value);
    if (Number.isNaN(parsed)) {
      throw new Error(`Invalid number for ${id}`);
    }
    return parsed;
  };

  const getSelect = <T extends string>(id: string): T => {
    const value = raw[id];
    if (!value) throw new Error(`Missing input: ${id}`);
    return value as T;
  };

  const inputs: InvestmentInputs = {
    starting_balance: 0,
    annual_return_rate: 0,
    years: 0,
    contribution_amount: 0,
    contribution_frequency: "none",
    contribution_timing: "end",
    compounding_frequency: "monthly",
  };

  if (fieldIds.includes("starting_balance")) {
    inputs.starting_balance = getNumber("starting_balance");
  }
  if (fieldIds.includes("target_amount")) {
    inputs.target_amount = getNumber("target_amount");
  }
  if (fieldIds.includes("annual_return_rate")) {
    inputs.annual_return_rate = getNumber("annual_return_rate");
  }
  if (fieldIds.includes("years")) {
    inputs.years = getNumber("years");
  }
  if (fieldIds.includes("contribution_amount")) {
    inputs.contribution_amount = getNumber("contribution_amount");
  }
  if (fieldIds.includes("contribution_frequency")) {
    inputs.contribution_frequency = getSelect<ContributionFrequency>(
      "contribution_frequency",
    );
  }
  if (fieldIds.includes("contribution_timing")) {
    inputs.contribution_timing = getSelect<ContributionTiming>(
      "contribution_timing",
    );
  }
  if (fieldIds.includes("compounding_frequency")) {
    inputs.compounding_frequency = getSelect<CompoundingFrequency>(
      "compounding_frequency",
    );
  }
  if (fieldIds.includes("withdrawal_amount")) {
    inputs.withdrawal_amount = getNumber("withdrawal_amount");
  }

  if (fieldIds.includes("starting_balance") && inputs.starting_balance < 0) {
    throw new Error("Starting balance cannot be negative");
  }
  if (fieldIds.includes("target_amount")) {
    if (inputs.target_amount === undefined || inputs.target_amount <= 0) {
      throw new Error("Target amount must be greater than zero");
    }
  }
  if (fieldIds.includes("annual_return_rate")) {
    if (inputs.annual_return_rate < 0 || inputs.annual_return_rate > 100) {
      throw new Error("Annual growth rate must be between 0 and 100");
    }
  }
  if (fieldIds.includes("years")) {
    if (inputs.years <= 0 || inputs.years > 100) {
      throw new Error("Years must be between 0 and 100");
    }
  }
  if (fieldIds.includes("contribution_amount") && inputs.contribution_amount < 0) {
    throw new Error("Contribution amount cannot be negative");
  }
  if (fieldIds.includes("withdrawal_amount")) {
    if (inputs.withdrawal_amount === undefined || inputs.withdrawal_amount <= 0) {
      throw new Error("Withdrawal amount must be greater than zero");
    }
  }

  return inputs;
}

export function runCalculatorProfile(
  profile: CalculatorProfile,
  inputs: InvestmentInputs,
): ProjectionResult {
  switch (profile) {
    case "future-value":
      return projectInvestment(inputs);
    case "compound-growth":
      return compoundLumpSumGrowth(
        inputs.starting_balance,
        inputs.annual_return_rate,
        inputs.years,
        inputs.compounding_frequency,
      );
    case "savings-goal": {
      const target = inputs.target_amount;
      if (target === undefined || target <= 0) {
        throw new Error("Target amount is required");
      }
      return projectSavingsGoal(inputs, target);
    }
    case "time-to-goal": {
      const target = inputs.target_amount;
      if (target === undefined || target <= 0) {
        throw new Error("Target amount is required");
      }
      return projectTimeToGoal(inputs, target);
    }
    case "required-return": {
      const target = inputs.target_amount;
      if (target === undefined || target <= 0) {
        throw new Error("Target amount is required");
      }
      return projectRequiredReturn(inputs, target);
    }
    case "initial-investment": {
      const target = inputs.target_amount;
      if (target === undefined || target <= 0) {
        throw new Error("Target amount is required");
      }
      return projectInitialInvestment(inputs, target);
    }
    case "doubling-time":
      return projectDoublingTime(
        inputs.starting_balance,
        inputs.annual_return_rate,
      );
    case "withdrawal-duration": {
      const withdrawal = inputs.withdrawal_amount;
      if (withdrawal === undefined || withdrawal <= 0) {
        throw new Error("Monthly withdrawal amount is required");
      }
      return projectWithdrawalDuration(
        inputs.starting_balance,
        withdrawal,
        inputs.annual_return_rate,
      );
    }
    default: {
      const _exhaustive: never = profile;
      throw new Error(`Unknown profile: ${String(_exhaustive)}`);
    }
  }
}
