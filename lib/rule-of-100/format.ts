import { parseIsoDate } from "@/lib/savings-path/format";

export {
  parseIsoDate,
  toIsoDate,
  todayIsoDate,
} from "@/lib/savings-path/format";

export function formatWeekdayShort(isoDate: string): string {
  return parseIsoDate(isoDate).toLocaleDateString("en-US", { weekday: "short" });
}

export function formatDayMonth(isoDate: string): string {
  return parseIsoDate(isoDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export function formatTimerDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
