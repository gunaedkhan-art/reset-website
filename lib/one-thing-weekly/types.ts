export type CheckInStatus = "pending" | "yes" | "partial" | "skipped";

export type BlockerTag =
  | "meetings"
  | "inbox"
  | "phone"
  | "unclear-task"
  | "too-big"
  | "low-energy"
  | "other";

export interface DailyCheckIn {
  date: string;
  status: CheckInStatus;
  blocker?: BlockerTag;
}

export type WeekOutcome = "yes" | "partial" | "no";

export interface WeekReview {
  finishedOneThing: WeekOutcome;
  reflection: string;
  completedAt: string;
}

export interface WeeklyPlan {
  id: string;
  oneThing: string;
  leadDomino?: string;
  weekStart: string;
  excludeWeekends: boolean;
  checkIns: DailyCheckIn[];
  review?: WeekReview;
}

export interface OneThingWeeklyStore {
  activePlan: WeeklyPlan | null;
  archivedWeeks: WeeklyPlan[];
}

export const ONE_THING_WEEKLY_STORAGE_KEY = "reset-one-thing-weekly-v2";
export const ONE_THING_WEEKLY_STORAGE_KEY_V1 = "reset-one-thing-weekly-v1";
export const ONE_THING_PREFILL_STORAGE_KEY = "reset-one-thing-prefill-v1";
export const MAX_ARCHIVED_WEEKS = 12;

export const BLOCKER_OPTIONS: {
  value: BlockerTag;
  label: string;
}[] = [
  { value: "meetings", label: "Meetings" },
  { value: "inbox", label: "Inbox / Slack" },
  { value: "phone", label: "Phone / feeds" },
  { value: "unclear-task", label: "Unclear task" },
  { value: "too-big", label: "ONE Thing too big" },
  { value: "low-energy", label: "Low energy" },
  { value: "other", label: "Other" },
];
