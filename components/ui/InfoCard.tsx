import Link from "next/link";
import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "./Card";

export interface InfoCardProps extends HTMLAttributes<HTMLDivElement> {
  title: string;
  description: string;
  href?: string;
  icon?: React.ReactNode;
  eyebrow?: string;
}

export function InfoCard({
  title,
  description,
  href,
  icon,
  eyebrow,
  className,
  ...props
}: InfoCardProps) {
  const content = (
    <Card hover={!!href} className={cn("h-full", className)} {...props}>
      <CardHeader>
        {eyebrow && (
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-primary">
            {eyebrow}
          </p>
        )}
        {icon && <div className="mb-3">{icon}</div>}
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
      >
        {content}
      </Link>
    );
  }

  return content;
}
