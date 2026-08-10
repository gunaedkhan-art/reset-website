export interface RuleOf100DayLog {
  date: string;
  count: number;
  timerSeconds?: number;
}

export interface RuleOf100Challenge {
  id: string;
  taskName: string;
  dailyTarget: number;
  createdAt: string;
  dayLogs: RuleOf100DayLog[];
}

export interface RuleOf100Store {
  activeChallenge: RuleOf100Challenge | null;
  archivedChallenges: RuleOf100Challenge[];
}

export const RULE_OF_100_STORAGE_KEY = "reset-rule-of-100-v1";
export const DEFAULT_DAILY_TARGET = 100;
export const MIN_DAILY_TARGET = 10;
export const MAX_DAILY_TARGET = 500;
export const MAX_ARCHIVED_CHALLENGES = 12;
