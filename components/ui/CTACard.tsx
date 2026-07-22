import Link from "next/link";
import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";
import { Button } from "./Button";
import { Card } from "./Card";

export interface CTACardProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  primaryAction?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  secondaryAction?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  variant?: "default" | "dark";
}

export function CTACard({
  title,
  description,
  primaryAction,
  secondaryAction,
  variant = "default",
  className,
  ...props
}: CTACardProps) {
  const isDark = variant === "dark";

  return (
    <Card
      className={cn(
        isDark
          ? "border-neutral-800 bg-neutral-900 text-white"
          : "border-neutral-200 bg-neutral-50",
        className,
      )}
      padding="lg"
      {...props}
    >
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="max-w-xl space-y-2">
          <h3
            className={cn(
              "text-xl font-semibold tracking-tight",
              isDark ? "text-white" : "text-neutral-900",
            )}
          >
            {title}
          </h3>
          <p
            className={cn(
              "text-sm leading-relaxed",
              isDark ? "text-neutral-300" : "text-neutral-600",
            )}
          >
            {description}
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
          {primaryAction &&
            (primaryAction.href ? (
              <Link href={primaryAction.href}>
                <Button
                  variant={isDark ? "secondary" : "primary"}
                  size="md"
                >
                  {primaryAction.label}
                </Button>
              </Link>
            ) : (
              <Button
                variant={isDark ? "secondary" : "primary"}
                size="md"
                onClick={primaryAction.onClick}
              >
                {primaryAction.label}
              </Button>
            ))}
          {secondaryAction &&
            (secondaryAction.href ? (
              <Link href={secondaryAction.href}>
                <Button variant="ghost" size="md">
                  {secondaryAction.label}
                </Button>
              </Link>
            ) : (
              <Button variant="ghost" size="md" onClick={secondaryAction.onClick}>
                {secondaryAction.label}
              </Button>
            ))}
        </div>
      </div>
    </Card>
  );
}
