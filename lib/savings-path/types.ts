export const SUPPORTED_CURRENCIES = [
  "USD",
  "GBP",
  "EUR",
  "INR",
  "AUD",
  "CAD",
] as const;

export type SupportedCurrency = (typeof SUPPORTED_CURRENCIES)[number];

export interface IncomeSource {
  id: string;
  label: string;
  amount: number;
  date: string;
}

export interface BalanceCheckIn {
  id: string;
  amount: number;
  date: string;
}

export interface SavingsGoal {
  targetAmount: number;
  targetDate: string;
  startAmount: number;
  startDate: string;
  currency: SupportedCurrency;
}

export interface SavingsPathPlan {
  goal: SavingsGoal;
  incomeSources: IncomeSource[];
  checkIns: BalanceCheckIn[];
}

export interface ChartPoint {
  date: string;
  amount: number;
}

export interface IncomeMarker {
  id: string;
  date: string;
  amount: number;
  label: string;
}

export interface TrackStatus {
  onTrack: boolean;
  gap: number;
  referenceDate: string;
  actualAmount: number;
  expectedAmount: number;
}

export interface SavingsPathChartModel {
  targetLine: ChartPoint[];
  progressLine: ChartPoint[];
  incomeMarkers: IncomeMarker[];
  start: ChartPoint;
  target: ChartPoint;
  status: TrackStatus;
  yMax: number;
}

export const SAVINGS_PATH_STORAGE_KEY = "reset-savings-path-tracker-v1";
