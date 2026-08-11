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
  size?: "default" | "focus";
}

const sizeStyles = {
  default: {
    shell: "h-36 w-36",
    count: "text-3xl",
    sub: "text-xs text-neutral-500",
    percent: "mt-3 text-sm font-medium text-neutral-700",
  },
  focus: {
    shell: "h-56 w-56 sm:h-64 sm:w-64",
    count: "text-6xl sm:text-7xl",
    sub: "text-sm text-neutral-400",
    percent: "mt-4 text-lg font-medium text-neutral-300",
  },
} as const;

const focusBandText: Record<DayScoreBand, string> = {
  complete: "text-emerald-400",
  partial: "text-amber-400",
  low: "text-rose-400",
  none: "text-neutral-400",
};

/** Circular gauge for today's Rule of 100 progress. */
export function RuleOf100Gauge({
  count,
  target,
  percent,
  band,
  className,
  size = "default",
}: RuleOf100GaugeProps) {
  const radius = size === "focus" ? 58 : 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;
  const styles = sizeStyles[size];
  const countColor = size === "focus" ? focusBandText[band] : bandText[band];
  const trackClass = size === "focus" ? "stroke-neutral-800" : "stroke-neutral-200";

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className={cn("relative", styles.shell)}>
        <svg viewBox="0 0 128 128" className="h-full w-full -rotate-90">
          <circle
            cx="64"
            cy="64"
            r={radius}
            fill="none"
            strokeWidth={size === "focus" ? 12 : 10}
            className={trackClass}
          />
          <circle
            cx="64"
            cy="64"
            r={radius}
            fill="none"
            strokeWidth={size === "focus" ? 12 : 10}
            strokeLinecap="round"
            className={cn("transition-all duration-300", bandStroke[band])}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={cn("font-semibold tabular-nums", styles.count, countColor)}>
            {count}
          </span>
          <span className={styles.sub}>of {target}</span>
        </div>
      </div>
      <p className={styles.percent}>{percent}% today</p>
    </div>
  );
}
