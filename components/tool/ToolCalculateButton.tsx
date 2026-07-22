"use client";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export interface ToolCalculateButtonProps {
  label?: string;
  loading?: boolean;
  disabled?: boolean;
  form?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  className?: string;
}

export function ToolCalculateButton({
  label = "Calculate",
  loading = false,
  disabled = false,
  form,
  type = "submit",
  onClick,
  className,
}: ToolCalculateButtonProps) {
  return (
    <Button
      type={type}
      form={form}
      onClick={onClick}
      disabled={disabled || loading}
      size="lg"
      fullWidth
      className={cn("sm:w-auto sm:min-w-[160px]", className)}
      aria-busy={loading}
    >
      {loading ? "Calculating…" : label}
    </Button>
  );
}
