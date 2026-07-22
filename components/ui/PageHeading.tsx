import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

export interface PageHeadingProps extends HTMLAttributes<HTMLDivElement> {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  as?: "h1" | "h2";
}

export function PageHeading({
  eyebrow,
  title,
  description,
  align = "left",
  as: Heading = "h1",
  className,
  children,
  ...props
}: PageHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-3xl space-y-4",
        align === "center" && "mx-auto text-center",
        className,
      )}
      {...props}
    >
      {eyebrow && (
        <p className="text-sm font-medium uppercase tracking-wider text-neutral-500">
          {eyebrow}
        </p>
      )}
      <Heading className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl lg:text-5xl">
        {title}
      </Heading>
      {description && (
        <p className="text-lg leading-relaxed text-neutral-600">{description}</p>
      )}
      {children}
    </div>
  );
}
