import type { DayScoreBand } from "@/lib/rule-of-100/calculate";
import { cn } from "@/lib/utils";

const bandStroke: Record<DayScoreBand, string> = {
  complete: "stroke-emerald-500",
  partial: "stroke-amber-500",
  low: "stroke-rose-400",
  none: "stroke-neutral-300",
};

const bandText: Record<DayScoreBand, string> = {
  complete: "text-emerald-700",
  partial: "text-amber-700",
  low: "text-rose-700",
  none: "text-neutral-500",
};

export interface RuleOf100GaugeProps {
  count: number;
  target: number;
  percent: number;
  band: DayScoreBand;
  className?: string;
}

/** Circular gauge for today's Rule of 100 progress. */
export function RuleOf100Gauge({
  count,
  target,
  percent,
  band,
  className,
}: RuleOf100GaugeProps) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="relative h-36 w-36">
        <svg viewBox="0 0 128 128" className="h-full w-full -rotate-90">
          <circle
            cx="64"
            cy="64"
            r={radius}
            fill="none"
            strokeWidth="10"
            className="stroke-neutral-200"
          />
          <circle
            cx="64"
            cy="64"
            r={radius}
            fill="none"
            strokeWidth="10"
            strokeLinecap="round"
            className={cn("transition-all duration-300", bandStroke[band])}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={cn("text-3xl font-semibold tabular-nums", bandText[band])}>
            {count}
          </span>
          <span className="text-xs text-neutral-500">of {target}</span>
        </div>
      </div>
      <p className="mt-3 text-sm font-medium text-neutral-700">{percent}% today</p>
    </div>
  );
}
