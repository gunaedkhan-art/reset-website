import type { ClusterTheme } from "@/lib/tools/cluster-themes";
import { cn } from "@/lib/utils";

export interface ThemedToolIconBadgeProps {
  theme: ClusterTheme | null;
  children: React.ReactNode;
  size?: "sm" | "md";
  className?: string;
}

/** Icon badge using cluster theme muted/primary colors — shared across browse surfaces. */
export function ThemedToolIconBadge({
  theme,
  children,
  size = "md",
  className,
}: ThemedToolIconBadgeProps) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center rounded-xl",
        size === "sm" ? "h-8 w-8" : "h-10 w-10",
        className,
      )}
      style={{
        backgroundColor: theme?.muted ?? "#f5f5f5",
        color: theme?.primary ?? "#404040",
      }}
    >
      {children}
    </div>
  );
}
