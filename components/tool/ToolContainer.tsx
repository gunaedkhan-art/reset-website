import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export interface ToolContainerProps extends HTMLAttributes<HTMLDivElement> {
  maxWidth?: "md" | "lg" | "xl" | "full";
}

const maxWidthMap = {
  md: "max-w-2xl",
  lg: "max-w-4xl",
  xl: "max-w-6xl",
  full: "max-w-none",
};

export function ToolContainer({
  maxWidth = "lg",
  className,
  children,
  ...props
}: ToolContainerProps) {
  return (
    <div
      className={cn("mx-auto w-full", maxWidthMap[maxWidth], className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function ToolFormSection({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function ToolResultsSection({
  className,
  children,
  title = "Results",
  empty = false,
  emptyMessage = "Your results will appear here after you calculate.",
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  title?: string;
  empty?: boolean;
  emptyMessage?: string;
}) {
  return (
    <section
      aria-labelledby="tool-results-heading"
      aria-live="polite"
      className={cn(
        "rounded-2xl border border-neutral-200 bg-neutral-50/80 p-6 shadow-sm sm:p-8",
        className,
      )}
      {...props}
    >
      <h2
        id="tool-results-heading"
        className="mb-4 text-lg font-semibold text-neutral-900"
      >
        {title}
      </h2>
      {empty ? (
        <p className="text-sm text-neutral-500">{emptyMessage}</p>
      ) : (
        children
      )}
    </section>
  );
}

export function ToolRelatedSection({
  className,
  children,
  title = "Related tools",
  ...props
}: HTMLAttributes<HTMLDivElement> & { title?: string }) {
  return (
    <section
      aria-labelledby="tool-related-heading"
      className={cn("", className)}
      {...props}
    >
      <h2
        id="tool-related-heading"
        className="mb-6 text-xl font-semibold tracking-tight text-neutral-900"
      >
        {title}
      </h2>
      {children}
    </section>
  );
}
