import { parseIsoDate, toIsoDate } from "@/lib/savings-path/format";

export { parseIsoDate, toIsoDate, todayIsoDate } from "@/lib/savings-path/format";

export function getMondayOfWeek(isoDate: string): string {
  const date = parseIsoDate(isoDate);
  const day = date.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + diff);
  return toIsoDate(date);
}

export function getWeekDays(weekStart: string): string[] {
  const days: string[] = [];
  for (let i = 0; i < 7; i++) {
    const date = parseIsoDate(weekStart);
    date.setDate(date.getDate() + i);
    days.push(toIsoDate(date));
  }
  return days;
}

export function formatWeekdayShort(isoDate: string): string {
  return parseIsoDate(isoDate).toLocaleDateString(undefined, { weekday: "short" });
}

export function formatDayMonth(isoDate: string): string {
  return parseIsoDate(isoDate).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export function formatWeekRange(weekStart: string): string {
  const days = getWeekDays(weekStart);
  const start = parseIsoDate(days[0]!);
  const end = parseIsoDate(days[6]!);
  const startLabel = start.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
  const endLabel = end.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year:
      end.getFullYear() !== start.getFullYear() ? "numeric" : undefined,
  });
  return `${startLabel} – ${endLabel}`;
}
