import { cn } from "@/lib/utils";
import { RESTART_ALT_PATH, brandColors } from "./restart-alt-path";

interface LogoMarkProps {
  size?: number;
  className?: string;
  /** Corner radius as a fraction of size (default 0.22 ≈ rounded-lg). */
  radiusRatio?: number;
}

export function LogoMark({
  size = 32,
  className,
  radiusRatio = 0.22,
}: LogoMarkProps) {
  const padding = size * 0.125;
  const iconSize = size - padding * 2;
  const radius = size * radiusRatio;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0", className)}
      aria-hidden="true"
    >
      <rect
        width={size}
        height={size}
        rx={radius}
        fill={brandColors.primary}
      />
      <g transform={`translate(${padding} ${padding})`}>
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path fill={brandColors.onPrimary} d={RESTART_ALT_PATH} />
        </svg>
      </g>
    </svg>
  );
}
