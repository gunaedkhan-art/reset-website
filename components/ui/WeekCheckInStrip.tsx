import { cn } from "@/lib/utils";
import type { WeekDayVisual } from "@/lib/one-thing-weekly/calculate";

const statusColors: Record<WeekDayVisual["status"], string> = {
  yes: "bg-emerald-500 border-emerald-600",
  partial: "bg-amber-400 border-amber-500",
  skipped: "bg-neutral-300 border-neutral-400",
  pending: "bg-white border-neutral-300",
  off: "bg-neutral-100 border-neutral-200",
};

export interface WeekCheckInStripProps {
  days: WeekDayVisual[];
  className?: string;
}

/** Seven-day check-in strip — at-a-glance week progress. */
export function WeekCheckInStrip({ days, className }: WeekCheckInStripProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex justify-between gap-1">
        {days.map((day) => (
          <div key={day.date} className="flex flex-1 flex-col items-center gap-1.5">
            <span
              className={cn(
                "text-[10px] font-medium uppercase tracking-wide",
                day.isToday ? "text-neutral-900" : "text-neutral-500",
              )}
            >
              {day.weekdayShort.slice(0, 3)}
            </span>
            <div
              title={
                day.status === "off"
                  ? "Weekend off"
                  : day.status === "pending" && day.isFuture
                    ? "Upcoming"
                    : day.status
              }
              className={cn(
                "h-3 w-full max-w-[2.5rem] rounded-full border-2 transition-colors",
                statusColors[day.status],
                day.isToday && "ring-2 ring-neutral-900/20 ring-offset-1",
                day.isFuture && day.status === "pending" && "opacity-50",
              )}
            />
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-neutral-500">
        <span className="inline-flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-emerald-500" /> Protected
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-amber-400" /> Partial
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-neutral-300" /> Missed
        </span>
      </div>
    </div>
  );
}
