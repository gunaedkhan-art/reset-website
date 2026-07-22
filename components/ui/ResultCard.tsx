import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./Card";

export interface ResultCardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  value?: React.ReactNode;
  description?: string;
  empty?: boolean;
  emptyMessage?: string;
}

export function ResultCard({
  title = "Result",
  value,
  description,
  empty = false,
  emptyMessage = "Results will appear here after you submit.",
  className,
  children,
  ...props
}: ResultCardProps) {
  return (
    <Card
      className={cn("border-neutral-200 bg-neutral-50/50", className)}
      padding="md"
      {...props}
    >
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && (
          <p className="text-sm text-neutral-600">{description}</p>
        )}
      </CardHeader>
      <CardContent>
        {empty ? (
          <p className="text-sm text-neutral-500">{emptyMessage}</p>
        ) : (
          <>
            {value && (
              <div className="text-2xl font-semibold tracking-tight text-neutral-900">
                {value}
              </div>
            )}
            {children}
          </>
        )}
      </CardContent>
    </Card>
  );
}
