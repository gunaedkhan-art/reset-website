import { periodsPerYearForCompounding, monthsBetweenContributions } from "./schedule";
import type {
  CompoundingFrequency,
  ContributionFrequency,
  InvestmentInputs,
  ProjectionResult,
  YearlyProjectionRow,
} from "./types";

function growthRatePerMonth(annualReturnRate: number): number {
  return Math.pow(1 + annualReturnRate / 100, 1 / 12) - 1;
}

function shouldContributeThisMonth(
  monthIndex: number,
  frequency: ContributionFrequency,
): boolean {
  if (frequency === "none") return false;
  const interval = monthsBetweenContributions(frequency);
  return monthIndex % interval === 0;
}

function buildYearlyRows(
  snapshots: {
    year: number;
    balance: number;
    contributionsThisYear: number;
    growthThisYear: number;
    cumulativeContributions: number;
    cumulativeGrowth: number;
  }[],
): YearlyProjectionRow[] {
  return snapshots.map((row) => ({ ...row }));
}

export function projectInvestment(inputs: InvestmentInputs): ProjectionResult {
  const totalMonths = Math.max(0, Math.round(inputs.years * 12));
  const monthlyRate = growthRatePerMonth(inputs.annual_return_rate);
  let balance = inputs.starting_balance;
  let totalContributions = 0;
  let cumulativeGrowth = 0;

  const yearlySnapshots: YearlyProjectionRow[] = [];
  let contributionsThisYear = 0;
  let growthThisYear = 0;
  let year = 1;

  for (let month = 1; month <= totalMonths; month++) {
    const contributes = shouldContributeThisMonth(
      month,
      inputs.contribution_frequency,
    );
    const contribution = contributes ? inputs.contribution_amount : 0;

    if (
      contribution > 0 &&
      inputs.contribution_timing === "beginning" &&
      contributes
    ) {
      balance += contribution;
      totalContributions += contribution;
      contributionsThisYear += contribution;
    }

    const balanceBeforeGrowth = balance;
    balance *= 1 + monthlyRate;
    const monthGrowth = balance - balanceBeforeGrowth;
    cumulativeGrowth += monthGrowth;
    growthThisYear += monthGrowth;

    if (
      contribution > 0 &&
      inputs.contribution_timing === "end" &&
      contributes
    ) {
      balance += contribution;
      totalContributions += contribution;
      contributionsThisYear += contribution;
    }

    if (month % 12 === 0 || month === totalMonths) {
      yearlySnapshots.push({
        year,
        balance,
        contributionsThisYear,
        growthThisYear,
        cumulativeContributions: totalContributions,
        cumulativeGrowth,
      });
      year++;
      contributionsThisYear = 0;
      growthThisYear = 0;
    }
  }

  const finalBalance = balance;
  const totalGrowth = cumulativeGrowth;
  const growthFromStartingBalance = Math.max(
    0,
    finalBalance - totalContributions - inputs.starting_balance,
  );
  const growthFromContributions = Math.max(0, totalGrowth - growthFromStartingBalance);

  const effectiveAnnualGrowthRate =
    inputs.years > 0 && inputs.starting_balance + totalContributions > 0
      ? (Math.pow(
          finalBalance / (inputs.starting_balance + totalContributions),
          1 / inputs.years,
        ) -
          1) *
        100
      : 0;

  return {
    finalBalance,
    totalContributions,
    totalGrowth,
    growthFromStartingBalance,
    growthFromContributions,
    effectiveAnnualGrowthRate,
    yearlyRows: buildYearlyRows(yearlySnapshots),
  };
}

export function compoundLumpSumGrowth(
  principal: number,
  annualReturnRate: number,
  years: number,
  compoundingFrequency: CompoundingFrequency,
): ProjectionResult {
  const periodsPerYear = periodsPerYearForCompounding(compoundingFrequency);
  const totalPeriods = Math.max(0, Math.round(years * periodsPerYear));
  const ratePerPeriod = annualReturnRate / 100 / periodsPerYear;

  const yearlySnapshots: YearlyProjectionRow[] = [];
  let balance = principal;
  let cumulativeGrowth = 0;

  for (let period = 1; period <= totalPeriods; period++) {
    const before = balance;
    balance *= 1 + ratePerPeriod;
    const periodGrowth = balance - before;
    cumulativeGrowth += periodGrowth;

    if (period % periodsPerYear === 0 || period === totalPeriods) {
      const year = Math.ceil(period / periodsPerYear);
      const prevGrowth = yearlySnapshots.at(-1)?.cumulativeGrowth ?? 0;
      yearlySnapshots.push({
        year,
        balance,
        contributionsThisYear: 0,
        growthThisYear: cumulativeGrowth - prevGrowth,
        cumulativeContributions: 0,
        cumulativeGrowth,
      });
    }
  }

  const finalBalance = balance;
  const totalGrowth = finalBalance - principal;

  return {
    finalBalance,
    totalContributions: 0,
    totalGrowth,
    growthFromStartingBalance: totalGrowth,
    growthFromContributions: 0,
    effectiveAnnualGrowthRate:
      years > 0 && principal > 0
        ? (Math.pow(finalBalance / principal, 1 / years) - 1) * 100
        : 0,
    yearlyRows: yearlySnapshots,
  };
}

export function solveRequiredContribution(
  inputs: Omit<InvestmentInputs, "contribution_amount">,
  targetAmount: number,
): number {
  if (targetAmount <= inputs.starting_balance) return 0;

  let low = 0;
  let high = targetAmount;
  let best = high;

  for (let i = 0; i < 64; i++) {
    const mid = (low + high) / 2;
    const result = projectInvestment({
      ...inputs,
      contribution_amount: mid,
    });

    if (result.finalBalance >= targetAmount) {
      best = mid;
      high = mid;
    } else {
      low = mid;
    }
  }

  return Math.ceil(best * 100) / 100;
}

export function projectSavingsGoal(
  inputs: InvestmentInputs,
  targetAmount: number,
): ProjectionResult {
  const requiredContribution = solveRequiredContribution(inputs, targetAmount);
  const projection = projectInvestment({
    ...inputs,
    contribution_amount: requiredContribution,
  });

  return {
    ...projection,
    requiredContribution,
  };
}

export function doublingTimeYears(annualReturnRate: number): number {
  if (annualReturnRate <= 0) return Infinity;
  return Math.log(2) / Math.log(1 + annualReturnRate / 100);
}

export function ruleOf72Years(annualReturnRate: number): number {
  if (annualReturnRate <= 0) return Infinity;
  return 72 / annualReturnRate;
}

function assertTargetReachable(
  finalBalance: number,
  targetAmount: number,
  message: string,
): void {
  if (finalBalance < targetAmount * 0.999) {
    throw new Error(message);
  }
}

export function solveRequiredYears(
  inputs: Omit<InvestmentInputs, "years">,
  targetAmount: number,
  maxYears = 100,
): number {
  if (targetAmount <= inputs.starting_balance) return 0;

  const atMax = projectInvestment({ ...inputs, years: maxYears });
  assertTargetReachable(
    atMax.finalBalance,
    targetAmount,
    `Target not reachable within ${maxYears} years with these assumptions. Try higher contributions or a lower goal.`,
  );

  let low = 0;
  let high = maxYears;
  let best = maxYears;

  for (let i = 0; i < 64; i++) {
    const mid = (low + high) / 2;
    const result = projectInvestment({ ...inputs, years: mid });

    if (result.finalBalance >= targetAmount) {
      best = mid;
      high = mid;
    } else {
      low = mid;
    }
  }

  return Math.round(best * 100) / 100;
}

export function solveRequiredReturnRate(
  inputs: Omit<InvestmentInputs, "annual_return_rate">,
  targetAmount: number,
): number {
  if (targetAmount <= inputs.starting_balance) return 0;

  const atZero = projectInvestment({ ...inputs, annual_return_rate: 0 });
  if (atZero.finalBalance >= targetAmount) return 0;

  const atMax = projectInvestment({ ...inputs, annual_return_rate: 100 });
  assertTargetReachable(
    atMax.finalBalance,
    targetAmount,
    "Target not reachable below a 100% annual growth rate with these assumptions.",
  );

  let low = 0;
  let high = 100;
  let best = 100;

  for (let i = 0; i < 64; i++) {
    const mid = (low + high) / 2;
    const result = projectInvestment({ ...inputs, annual_return_rate: mid });

    if (result.finalBalance >= targetAmount) {
      best = mid;
      high = mid;
    } else {
      low = mid;
    }
  }

  return Math.round(best * 1000) / 1000;
}

export function solveRequiredStartingBalance(
  inputs: Omit<InvestmentInputs, "starting_balance">,
  targetAmount: number,
): number {
  const contributionsOnly = projectInvestment({
    ...inputs,
    starting_balance: 0,
  });

  if (contributionsOnly.finalBalance >= targetAmount) return 0;

  const atTarget = targetAmount;
  let low = 0;
  let high = atTarget;
  let best = atTarget;

  for (let i = 0; i < 64; i++) {
    const mid = (low + high) / 2;
    const result = projectInvestment({ ...inputs, starting_balance: mid });

    if (result.finalBalance >= targetAmount) {
      best = mid;
      high = mid;
    } else {
      low = mid;
    }
  }

  return Math.ceil(best * 100) / 100;
}

export function projectTimeToGoal(
  inputs: InvestmentInputs,
  targetAmount: number,
): ProjectionResult {
  const requiredYears = solveRequiredYears(
    {
      starting_balance: inputs.starting_balance,
      target_amount: inputs.target_amount,
      annual_return_rate: inputs.annual_return_rate,
      contribution_amount: inputs.contribution_amount,
      contribution_frequency: inputs.contribution_frequency,
      contribution_timing: inputs.contribution_timing,
      compounding_frequency: inputs.compounding_frequency,
    },
    targetAmount,
  );
  const projection = projectInvestment({ ...inputs, years: requiredYears });

  return {
    ...projection,
    requiredYears,
  };
}

export function projectRequiredReturn(
  inputs: InvestmentInputs,
  targetAmount: number,
): ProjectionResult {
  const requiredReturnRate = solveRequiredReturnRate(
    {
      starting_balance: inputs.starting_balance,
      target_amount: inputs.target_amount,
      years: inputs.years,
      contribution_amount: inputs.contribution_amount,
      contribution_frequency: inputs.contribution_frequency,
      contribution_timing: inputs.contribution_timing,
      compounding_frequency: inputs.compounding_frequency,
    },
    targetAmount,
  );
  const projection = projectInvestment({
    ...inputs,
    annual_return_rate: requiredReturnRate,
  });

  return {
    ...projection,
    requiredReturnRate,
  };
}

export function projectInitialInvestment(
  inputs: InvestmentInputs,
  targetAmount: number,
): ProjectionResult {
  const requiredStartingBalance = solveRequiredStartingBalance(
    {
      target_amount: inputs.target_amount,
      annual_return_rate: inputs.annual_return_rate,
      years: inputs.years,
      contribution_amount: inputs.contribution_amount,
      contribution_frequency: inputs.contribution_frequency,
      contribution_timing: inputs.contribution_timing,
      compounding_frequency: inputs.compounding_frequency,
    },
    targetAmount,
  );
  const projection = projectInvestment({
    ...inputs,
    starting_balance: requiredStartingBalance,
  });

  return {
    ...projection,
    requiredStartingBalance,
  };
}

export function projectDoublingTime(
  startingBalance: number,
  annualReturnRate: number,
): ProjectionResult {
  if (annualReturnRate <= 0) {
    throw new Error("Annual growth rate must be above 0% to calculate doubling time.");
  }

  const doublingTimeExact = doublingTimeYears(annualReturnRate);
  const ruleOf72Estimate = ruleOf72Years(annualReturnRate);
  const balanceAtDouble = startingBalance * 2;
  const chartYears = Math.min(Math.max(Math.ceil(doublingTimeExact) + 1, 2), 50);

  const projection = compoundLumpSumGrowth(
    startingBalance,
    annualReturnRate,
    chartYears,
    "monthly",
  );

  return {
    ...projection,
    doublingTimeExact,
    ruleOf72Estimate,
    ruleOf72Difference: Math.abs(doublingTimeExact - ruleOf72Estimate),
    balanceAtDouble,
    finalBalance: balanceAtDouble,
  };
}

export function projectWithdrawalDuration(
  startingBalance: number,
  monthlyWithdrawal: number,
  annualReturnRate: number,
  maxYears = 100,
): ProjectionResult {
  if (startingBalance <= 0) {
    throw new Error("Starting balance must be greater than zero.");
  }
  if (monthlyWithdrawal <= 0) {
    throw new Error("Monthly withdrawal must be greater than zero.");
  }

  const monthlyRate = growthRatePerMonth(annualReturnRate);
  let balance = startingBalance;
  let month = 0;
  let totalWithdrawn = 0;
  let cumulativeGrowth = 0;
  const yearlySnapshots: YearlyProjectionRow[] = [];
  let withdrawalsThisYear = 0;
  let growthThisYear = 0;
  let year = 1;

  while (month < maxYears * 12) {
    month++;

    const beforeGrowth = balance;
    balance *= 1 + monthlyRate;
    const monthGrowth = balance - beforeGrowth;
    cumulativeGrowth += monthGrowth;
    growthThisYear += monthGrowth;

    const withdrawal = Math.min(monthlyWithdrawal, balance);
    balance -= withdrawal;
    totalWithdrawn += withdrawal;
    withdrawalsThisYear += withdrawal;

    if (balance < 0.01) {
      balance = 0;
    }

    if (month % 12 === 0 || balance <= 0) {
      yearlySnapshots.push({
        year,
        balance,
        contributionsThisYear: 0,
        growthThisYear,
        cumulativeContributions: 0,
        cumulativeGrowth,
        withdrawalsThisYear,
        cumulativeWithdrawals: totalWithdrawn,
      });
      year++;
      withdrawalsThisYear = 0;
      growthThisYear = 0;
    }

    if (balance <= 0) {
      break;
    }
  }

  if (balance > 0) {
    throw new Error(
      `Balance lasts more than ${maxYears} years at this withdrawal rate. Try a lower withdrawal or higher growth assumption.`,
    );
  }

  const withdrawalDurationYears = month / 12;

  return {
    finalBalance: 0,
    totalContributions: 0,
    totalGrowth: cumulativeGrowth,
    growthFromStartingBalance: cumulativeGrowth,
    growthFromContributions: 0,
    withdrawalDurationYears,
    totalWithdrawn,
    effectiveAnnualGrowthRate: annualReturnRate,
    yearlyRows: yearlySnapshots,
  };
}
