import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

const variants = {
  info: "border-neutral-200 bg-neutral-50 text-neutral-800",
  success: "border-emerald-200 bg-emerald-50 text-emerald-900",
  warning: "border-amber-200 bg-amber-50 text-amber-900",
  error: "border-red-200 bg-red-50 text-red-900",
} as const;

export interface CalloutProps extends HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof variants;
  title?: string;
}

export function Callout({
  variant = "info",
  title,
  className,
  children,
  ...props
}: CalloutProps) {
  return (
    <div
      role="note"
      className={cn(
        "rounded-xl border px-4 py-3 text-sm leading-relaxed",
        variants[variant],
        className,
      )}
      {...props}
    >
      {title && <p className="mb-1 font-semibold">{title}</p>}
      <div>{children}</div>
    </div>
  );
}
