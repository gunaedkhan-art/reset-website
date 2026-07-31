export type CheckInStatus = "pending" | "yes" | "partial" | "skipped";

export interface DailyCheckIn {
  date: string;
  status: CheckInStatus;
}

export interface WeeklyPlan {
  id: string;
  oneThing: string;
  weekStart: string;
  checkIns: DailyCheckIn[];
}

export interface OneThingWeeklyStore {
  activePlan: WeeklyPlan | null;
  archivedWeeks: WeeklyPlan[];
}

export const ONE_THING_WEEKLY_STORAGE_KEY = "reset-one-thing-weekly-v1";
export const MAX_ARCHIVED_WEEKS = 12;
