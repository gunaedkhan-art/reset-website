/** Shared constants — referenced in config expressions via constants.* */
export const ENGINE_CONSTANTS = {
  DAYS_PER_YEAR: 365,
  WEEKS_PER_YEAR: 52,
  WORK_HOURS_PER_DAY: 8,
  WORK_HOURS_PER_WEEK: 40,
  MINUTES_LOST_PER_NOTIFICATION: 5,
  MINUTES_LOST_PER_CONTEXT_SWITCH: 15,
  ILLUSTRATIVE_HOURLY_WAGE: 35,
} as const;
