"use client";

import { expectedAmountAtDate } from "@/lib/savings-path/calculate";
import {
  formatChartDate,
  formatCompactCurrency,
  formatCurrency,
  parseIsoDate,
} from "@/lib/savings-path/format";
import type { SavingsGoal, SavingsPathChartModel } from "@/lib/savings-path/types";
import { cn } from "@/lib/utils";

export interface SavingsPathChartProps {
  model: SavingsPathChartModel;
  goal: SavingsGoal;
  className?: string;
  height?: number;
}

export function SavingsPathChart({
  model,
  goal,
  className,
  height = 280,
}: SavingsPathChartProps) {
  const width = 720;
  const padding = { top: 28, right: 20, bottom: 40, left: 64 };
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  const startMs = parseIsoDate(goal.startDate).getTime();
  const endMs = parseIsoDate(goal.targetDate).getTime();
  const rangeMs = Math.max(endMs - startMs, 1);

  const xForDate = (dateIso: string): number => {
    const ms = parseIsoDate(dateIso).getTime();
    const fraction = (ms - startMs) / rangeMs;
    return padding.left + fraction * innerWidth;
  };

  const yForAmount = (amount: number): number => {
    const fraction = amount / model.yMax;
    return padding.top + innerHeight - fraction * innerHeight;
  };

  const toPoints = (points: { date: string; amount: number }[]): string =>
    points.map((point) => `${xForDate(point.date)},${yForAmount(point.amount)}`).join(" ");

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((fraction) => ({
    fraction,
    value: model.yMax * fraction,
    y: padding.top + innerHeight - fraction * innerHeight,
  }));

  const xLabels = [model.start, model.target].map((point) => ({
    ...point,
    x: xForDate(point.date),
  }));

  return (
    <figure className={cn("w-full", className)}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full max-w-full"
        role="img"
        aria-label={`Savings path chart from ${formatChartDate(goal.startDate)} to ${formatChartDate(goal.targetDate)}`}
      >
        {yTicks.map((tick) => (
          <g key={tick.fraction}>
            <line
              x1={padding.left}
              x2={width - padding.right}
              y1={tick.y}
              y2={tick.y}
              stroke="#e5e5e5"
              strokeWidth={1}
            />
            <text
              x={padding.left - 8}
              y={tick.y + 4}
              textAnchor="end"
              className="fill-neutral-500 text-[10px]"
            >
              {formatCompactCurrency(tick.value, goal.currency)}
            </text>
          </g>
        ))}

        <polyline
          fill="none"
          stroke="#00C3FF"
          strokeWidth={3}
          points={toPoints(model.targetLine)}
        />

        {model.progressLine.length > 1 && (
          <polyline
            fill="none"
            stroke="#7DD3FC"
            strokeWidth={2.5}
            strokeDasharray="6 5"
            points={toPoints(model.progressLine)}
          />
        )}

        {model.progressLine.map((point) => (
          <circle
            key={`progress-${point.date}-${point.amount}`}
            cx={xForDate(point.date)}
            cy={yForAmount(point.amount)}
            r={5}
            fill="#BAE6FD"
            stroke="#0284C7"
            strokeWidth={1.5}
          />
        ))}

        <circle
          cx={xForDate(model.start.date)}
          cy={yForAmount(model.start.amount)}
          r={6}
          fill="#00A3D9"
        />
        <circle
          cx={xForDate(model.target.date)}
          cy={yForAmount(model.target.amount)}
          r={6}
          fill="#023047"
        />

        {model.incomeMarkers.map((marker) => {
          const baseY = yForAmount(expectedAmountAtDate(goal, marker.date));
          const iconY = baseY - 18;
          const x = xForDate(marker.date);
          return (
            <g key={marker.id} aria-label={`${marker.label}: ${formatCurrency(marker.amount, goal.currency)}`}>
              <line
                x1={x}
                x2={x}
                y1={baseY}
                y2={iconY + 8}
                stroke="#CBD5E1"
                strokeWidth={1}
                strokeDasharray="2 3"
              />
              <circle cx={x} cy={iconY} r={11} fill="#E0F2FE" stroke="#38BDF8" strokeWidth={1.5} />
              <text
                x={x}
                y={iconY + 4}
                textAnchor="middle"
                className="fill-sky-700 text-[11px] font-semibold"
              >
                $
              </text>
              <title>
                {marker.label}: {formatCurrency(marker.amount, goal.currency)} on{" "}
                {formatChartDate(marker.date)}
              </title>
            </g>
          );
        })}

        {xLabels.map((point) => (
          <text
            key={point.date}
            x={point.x}
            y={height - 10}
            textAnchor={point.date === model.target.date ? "end" : "start"}
            className="fill-neutral-600 text-[10px]"
          >
            {formatChartDate(point.date)}
          </text>
        ))}
      </svg>

      <figcaption className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-neutral-600">
        <span className="inline-flex items-center gap-2">
          <span className="h-0.5 w-6 bg-primary" aria-hidden="true" />
          Target path
        </span>
        <span className="inline-flex items-center gap-2">
          <span
            className="h-0.5 w-6 border-t-2 border-dashed border-sky-300"
            aria-hidden="true"
          />
          Your updates
        </span>
        <span className="inline-flex items-center gap-2">
          <span
            className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-sky-300 bg-sky-50 text-[10px] font-semibold text-sky-700"
            aria-hidden="true"
          >
            $
          </span>
          Income dates
        </span>
      </figcaption>
    </figure>
  );
}
