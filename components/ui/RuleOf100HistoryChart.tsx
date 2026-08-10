import type { DayHistoryVisual } from "@/lib/rule-of-100/calculate";
import { cn } from "@/lib/utils";

const bandFill: Record<DayHistoryVisual["band"], string> = {
  complete: "bg-emerald-500",
  partial: "bg-amber-500",
  low: "bg-rose-400",
  none: "bg-neutral-200",
};

export interface RuleOf100HistoryChartProps {
  days: DayHistoryVisual[];
  className?: string;
}

/** Daily Rule of 100 completion bars — one line per day. */
export function RuleOf100HistoryChart({ days, className }: RuleOf100HistoryChartProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-end gap-1.5">
        {days.map((day) => (
          <div key={day.date} className="flex flex-1 flex-col items-center gap-2">
            <div className="flex h-28 w-full items-end justify-center">
              <div
                title={`${day.count} / ${day.target} (${day.percent}%)`}
                className={cn(
                  "w-full max-w-[2rem] rounded-t-md transition-all",
                  bandFill[day.band],
                  day.isToday && "ring-2 ring-neutral-900/15 ring-offset-1",
                )}
                style={{ height: `${Math.max(day.percent, day.count > 0 ? 8 : 4)}%` }}
              />
            </div>
            <span
              className={cn(
                "text-[10px] font-medium uppercase tracking-wide",
                day.isToday ? "text-neutral-900" : "text-neutral-500",
              )}
            >
              {day.weekdayShort.slice(0, 3)}
            </span>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-neutral-500">
        <span className="inline-flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-emerald-500" /> 100 complete
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-amber-500" /> 50–99
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-rose-400" /> 1–49
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="h-2 w-2 rounded-full bg-neutral-200" /> 0
        </span>
      </div>
    </div>
  );
}
