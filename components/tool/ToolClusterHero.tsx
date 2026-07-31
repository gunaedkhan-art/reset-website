import type { ClusterTheme } from "@/lib/tools/cluster-themes";
import { ToolIcon, type ToolIconName } from "@/components/tool/ToolIcon";
import { cn } from "@/lib/utils";

export interface ToolClusterHeroProps {
  theme: ClusterTheme;
  icon: ToolIconName;
  title: string;
  className?: string;
}

/** Themed header graphic for tool and cluster hub pages. */
export function ToolClusterHero({
  theme,
  icon,
  title,
  className,
}: ToolClusterHeroProps) {
  return (
    <div
      className={cn(
        "relative mb-6 overflow-hidden rounded-2xl border border-neutral-200/80 px-5 py-6 sm:px-8 sm:py-8",
        className,
      )}
      style={{
        background: `linear-gradient(135deg, ${theme.heroFrom} 0%, ${theme.heroTo} 100%)`,
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full opacity-40 blur-2xl"
        style={{ backgroundColor: theme.accent }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-10 left-1/3 h-32 w-32 rounded-full opacity-30 blur-2xl"
        style={{ backgroundColor: theme.secondary }}
      />
      <div className="relative flex items-center gap-4">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-2xl shadow-sm"
          style={{
            backgroundColor: theme.primary,
            color: theme.onPrimary,
          }}
        >
          <ToolIcon name={icon} size={28} />
        </div>
        <div className="min-w-0">
          <p
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: theme.primary }}
          >
            {theme.name}
          </p>
          <p className="mt-1 line-clamp-2 text-sm font-medium text-neutral-800">{title}</p>
        </div>
      </div>
    </div>
  );
}
