"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
  className,
}: CollapsibleSectionProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={cn("rounded-2xl border border-neutral-200 bg-white shadow-sm", className)}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left text-sm font-semibold text-neutral-900 transition-colors hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-neutral-900 sm:px-5"
      >
        {title}
        <span
          aria-hidden="true"
          className={cn(
            "text-neutral-400 transition-transform duration-200",
            open && "rotate-180",
          )}
        >
          ▾
        </span>
      </button>
      {open && <div className="border-t border-neutral-200 px-4 py-4 sm:px-5">{children}</div>}
    </div>
  );
}
