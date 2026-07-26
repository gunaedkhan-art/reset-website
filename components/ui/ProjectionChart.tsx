import { cn } from "@/lib/utils";

export interface ProjectionChartPoint {
  label: string;
  balance: number;
  contributions?: number;
}

export interface ProjectionChartProps {
  data: ProjectionChartPoint[];
  className?: string;
  height?: number;
  showContributions?: boolean;
}

export function ProjectionChart({
  data,
  className,
  height = 220,
  showContributions = true,
}: ProjectionChartProps) {
  if (data.length === 0) {
    return null;
  }

  const width = 640;
  const padding = { top: 16, right: 16, bottom: 32, left: 56 };
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  const maxBalance = Math.max(...data.map((point) => point.balance), 1);
  const xStep = data.length > 1 ? innerWidth / (data.length - 1) : 0;

  const balancePoints = data
    .map((point, index) => {
      const x = padding.left + index * xStep;
      const y =
        padding.top + innerHeight - (point.balance / maxBalance) * innerHeight;
      return `${x},${y}`;
    })
    .join(" ");

  const contributionPoints = showContributions &&
    data.some((point) => point.contributions !== undefined)
    ? data
        .map((point, index) => {
          const x = padding.left + index * xStep;
          const value = point.contributions ?? 0;
          const y =
            padding.top + innerHeight - (value / maxBalance) * innerHeight;
          return `${x},${y}`;
        })
        .join(" ")
    : null;

  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((fraction) => ({
    fraction,
    value: maxBalance * fraction,
    y: padding.top + innerHeight - fraction * innerHeight,
  }));

  return (
    <figure className={cn("w-full", className)}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full max-w-full"
        role="img"
        aria-label="Balance growth over time chart"
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
              {formatCompactCurrency(tick.value)}
            </text>
          </g>
        ))}

        {contributionPoints && (
          <polyline
            fill="none"
            stroke="#94a3b8"
            strokeWidth={2}
            strokeDasharray="4 4"
            points={contributionPoints}
          />
        )}

        <polyline
          fill="none"
          stroke="#00C3FF"
          strokeWidth={3}
          points={balancePoints}
        />

        {data.map((point, index) => {
          const x = padding.left + index * xStep;
          const y =
            padding.top +
            innerHeight -
            (point.balance / maxBalance) * innerHeight;
          const showLabel =
            index === 0 ||
            index === data.length - 1 ||
            index % Math.ceil(data.length / 6) === 0;
          return (
            <g key={point.label}>
              <circle cx={x} cy={y} r={4} fill="#00A3D9" />
              {showLabel && (
                <text
                  x={x}
                  y={height - 8}
                  textAnchor="middle"
                  className="fill-neutral-600 text-[10px]"
                >
                  {point.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <figcaption className="mt-2 flex flex-wrap gap-4 text-xs text-neutral-600">
        <span className="inline-flex items-center gap-2">
          <span className="h-0.5 w-6 bg-primary" aria-hidden="true" />
          Ending balance
        </span>
        {contributionPoints && (
          <span className="inline-flex items-center gap-2">
            <span
              className="h-0.5 w-6 border-t-2 border-dashed border-neutral-400"
              aria-hidden="true"
            />
            Total contributed
          </span>
        )}
      </figcaption>
    </figure>
  );
}

function formatCompactCurrency(value: number): string {
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  }
  if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(0)}k`;
  }
  return `$${Math.round(value)}`;
}
