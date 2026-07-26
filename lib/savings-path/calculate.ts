import { parseIsoDate, toIsoDate } from "./format";
import type {
  BalanceCheckIn,
  ChartPoint,
  IncomeMarker,
  IncomeSource,
  SavingsGoal,
  SavingsPathChartModel,
  SavingsPathPlan,
  TrackStatus,
} from "./types";

function daysBetween(startIso: string, endIso: string): number {
  const start = parseIsoDate(startIso);
  const end = parseIsoDate(endIso);
  const ms = end.getTime() - start.getTime();
  return Math.max(0, Math.round(ms / (1000 * 60 * 60 * 24)));
}

function addDays(isoDate: string, days: number): string {
  const date = parseIsoDate(isoDate);
  date.setDate(date.getDate() + days);
  return toIsoDate(date);
}

export function expectedAmountAtDate(goal: SavingsGoal, dateIso: string): number {
  const totalDays = daysBetween(goal.startDate, goal.targetDate);
  if (totalDays === 0) return goal.targetAmount;

  const elapsedDays = daysBetween(goal.startDate, dateIso);
  const progress = Math.min(1, Math.max(0, elapsedDays / totalDays));
  return goal.startAmount + (goal.targetAmount - goal.startAmount) * progress;
}

export function buildTargetLine(goal: SavingsGoal, sampleCount = 2): ChartPoint[] {
  if (sampleCount < 2) sampleCount = 2;

  const totalDays = daysBetween(goal.startDate, goal.targetDate);
  const points: ChartPoint[] = [];

  for (let i = 0; i < sampleCount; i++) {
    const fraction = i / (sampleCount - 1);
    const dayOffset = Math.round(totalDays * fraction);
    const date = addDays(goal.startDate, dayOffset);
    points.push({
      date,
      amount: expectedAmountAtDate(goal, date),
    });
  }

  return points;
}

export function buildProgressLine(
  goal: SavingsGoal,
  checkIns: BalanceCheckIn[],
): ChartPoint[] {
  const points: ChartPoint[] = [
    { date: goal.startDate, amount: goal.startAmount },
    ...checkIns
      .filter(
        (checkIn) =>
          checkIn.date >= goal.startDate && checkIn.date <= goal.targetDate,
      )
      .map((checkIn) => ({ date: checkIn.date, amount: checkIn.amount }))
      .sort((a, b) => a.date.localeCompare(b.date)),
  ];

  const deduped = new Map<string, ChartPoint>();
  for (const point of points) {
    deduped.set(point.date, point);
  }

  return [...deduped.values()].sort((a, b) => a.date.localeCompare(b.date));
}

export function buildIncomeMarkers(
  goal: SavingsGoal,
  incomeSources: IncomeSource[],
): IncomeMarker[] {
  return incomeSources
    .filter(
      (source) =>
        source.amount > 0 &&
        source.date >= goal.startDate &&
        source.date <= goal.targetDate,
    )
    .map((source) => ({
      id: source.id,
      date: source.date,
      amount: source.amount,
      label: source.label.trim() || "Income",
    }))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function getTrackStatus(
  goal: SavingsGoal,
  checkIns: BalanceCheckIn[],
  asOfDate?: string,
): TrackStatus {
  const referenceDate = asOfDate ?? todayWithinPlan(goal);
  const progressLine = buildProgressLine(goal, checkIns);
  const latestPoint =
    [...progressLine].reverse().find((point) => point.date <= referenceDate) ??
    progressLine[0]!;

  const expectedAmount = expectedAmountAtDate(goal, latestPoint.date);
  const gap = latestPoint.amount - expectedAmount;

  return {
    onTrack: gap >= 0,
    gap,
    referenceDate: latestPoint.date,
    actualAmount: latestPoint.amount,
    expectedAmount,
  };
}

function todayWithinPlan(goal: SavingsGoal): string {
  const today = toIsoDate(new Date());
  if (today < goal.startDate) return goal.startDate;
  if (today > goal.targetDate) return goal.targetDate;
  return today;
}

export function buildChartModel(plan: SavingsPathPlan): SavingsPathChartModel {
  const { goal, incomeSources, checkIns } = plan;
  const targetLine = buildTargetLine(goal);
  const progressLine = buildProgressLine(goal, checkIns);
  const incomeMarkers = buildIncomeMarkers(goal, incomeSources);
  const status = getTrackStatus(goal, checkIns);

  const yMax = Math.max(
    goal.targetAmount,
    ...progressLine.map((point) => point.amount),
    ...incomeMarkers.map((marker) => expectedAmountAtDate(goal, marker.date) + marker.amount),
    1,
  );

  return {
    targetLine,
    progressLine,
    incomeMarkers,
    start: { date: goal.startDate, amount: goal.startAmount },
    target: { date: goal.targetDate, amount: goal.targetAmount },
    status,
    yMax,
  };
}

export interface SavingsPathInputValues {
  targetAmount: string;
  targetDate: string;
  startAmount: string;
  startDate: string;
  currency: string;
}

export interface ParsedSavingsPathInput {
  goal: SavingsGoal;
}

export function parseSavingsPathInput(
  values: SavingsPathInputValues,
): ParsedSavingsPathInput {
  const targetAmount = Number.parseFloat(values.targetAmount);
  const startAmount = Number.parseFloat(values.startAmount);

  if (Number.isNaN(targetAmount) || targetAmount <= 0) {
    throw new Error("Target amount must be greater than zero.");
  }
  if (Number.isNaN(startAmount) || startAmount < 0) {
    throw new Error("Starting amount cannot be negative.");
  }
  if (targetAmount <= startAmount) {
    throw new Error("Target amount must be higher than your starting amount.");
  }
  if (!values.targetDate || !values.startDate) {
    throw new Error("Start and target dates are required.");
  }
  if (values.targetDate <= values.startDate) {
    throw new Error("Target date must be after your start date.");
  }

  const currency = values.currency as SavingsGoal["currency"];
  if (!["USD", "GBP", "EUR", "INR", "AUD", "CAD"].includes(currency)) {
    throw new Error("Unsupported currency.");
  }

  return {
    goal: {
      targetAmount,
      targetDate: values.targetDate,
      startAmount,
      startDate: values.startDate,
      currency,
    },
  };
}

export function parseCheckInInput(amountRaw: string, dateRaw: string): BalanceCheckIn {
  const amount = Number.parseFloat(amountRaw);
  if (Number.isNaN(amount) || amount < 0) {
    throw new Error("Check-in amount cannot be negative.");
  }
  if (!dateRaw) {
    throw new Error("Check-in date is required.");
  }

  return {
    id: crypto.randomUUID(),
    amount,
    date: dateRaw,
  };
}

export function parseIncomeSourceInput(
  amountRaw: string,
  dateRaw: string,
  labelRaw: string,
): IncomeSource {
  const amount = Number.parseFloat(amountRaw);
  if (Number.isNaN(amount) || amount <= 0) {
    throw new Error("Income amount must be greater than zero.");
  }
  if (!dateRaw) {
    throw new Error("Income date is required.");
  }

  return {
    id: crypto.randomUUID(),
    amount,
    date: dateRaw,
    label: labelRaw.trim(),
  };
}
