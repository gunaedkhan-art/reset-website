import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  as?: "section" | "div";
  container?: boolean;
  spacing?: "sm" | "md" | "lg";
  id?: string;
}

const spacingMap = {
  sm: "py-10 md:py-12",
  md: "py-14 md:py-20",
  lg: "py-20 md:py-28",
};

export function Section({
  as: Component = "section",
  container = true,
  spacing = "md",
  className,
  children,
  ...props
}: SectionProps) {
  return (
    <Component
      className={cn(spacingMap[spacing], className)}
      {...props}
    >
      {container ? (
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      ) : (
        children
      )}
    </Component>
  );
}
