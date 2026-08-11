"use client";

import { useEffect, useRef, useState } from "react";
import type { DayScoreBand } from "@/lib/rule-of-100/calculate";
import { RuleOf100Gauge } from "@/components/ui/RuleOf100Gauge";
import { cn } from "@/lib/utils";

const bandMessage: Record<DayScoreBand, string> = {
  complete: "Target hit — keep the momentum or exit focus mode.",
  partial: "Past halfway. Space to add another rep.",
  low: "Every rep counts. Hit space when you finish one.",
  none: "Press space each time you complete a rep.",
};

export interface RuleOf100FocusModeProps {
  open: boolean;
  onClose: () => void;
  taskName: string;
  count: number;
  target: number;
  percent: number;
  band: DayScoreBand;
  onIncrement: () => void;
}

/** Full-screen rep counter — spacebar adds +1. */
export function RuleOf100FocusMode({
  open,
  onClose,
  taskName,
  count,
  target,
  percent,
  band,
  onIncrement,
}: RuleOf100FocusModeProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);
  const onIncrementRef = useRef(onIncrement);
  const enteredFullscreenRef = useRef(false);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    onCloseRef.current = onClose;
    onIncrementRef.current = onIncrement;
  }, [onClose, onIncrement]);

  const pulseIncrement = () => {
    onIncrementRef.current();
    setPulse(true);
    window.setTimeout(() => setPulse(false), 180);
  };

  useEffect(() => {
    if (!open) return;

    enteredFullscreenRef.current = false;
    document.body.style.overflow = "hidden";
    const overlay = overlayRef.current;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault();
        pulseIncrement();
      }

      if (event.code === "Escape") {
        event.preventDefault();
        onCloseRef.current();
      }
    };

    const onFullscreenChange = () => {
      if (document.fullscreenElement === overlay) {
        enteredFullscreenRef.current = true;
        return;
      }

      if (enteredFullscreenRef.current) {
        onCloseRef.current();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    document.addEventListener("fullscreenchange", onFullscreenChange);

    const frame = window.requestAnimationFrame(() => {
      void overlay?.requestFullscreen?.().catch(() => {});
    });

    return () => {
      window.cancelAnimationFrame(frame);
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      if (document.fullscreenElement === overlay) {
        void document.exitFullscreen().catch(() => {});
      }
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex flex-col bg-neutral-950 text-white"
      role="dialog"
      aria-modal="true"
      aria-label="Focus mode"
    >
      <div className="flex items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
            Focus mode
          </p>
          <p className="mt-1 truncate text-sm text-neutral-300">{taskName}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex h-10 shrink-0 items-center justify-center rounded-xl border border-neutral-700 bg-neutral-900 px-4 text-sm font-medium text-white transition-colors hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
        >
          Exit focus mode
        </button>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6 pb-16">
        <div className={cn("transition-transform duration-150", pulse && "scale-105")}>
          <RuleOf100Gauge
            count={count}
            target={target}
            percent={percent}
            band={band}
            size="focus"
          />
        </div>

        <p className="mt-10 max-w-md text-center text-base text-neutral-300">
          {bandMessage[band]}
        </p>

        <button
          type="button"
          onClick={pulseIncrement}
          className="mt-8 inline-flex h-14 min-w-[10rem] items-center justify-center rounded-2xl bg-white px-8 text-base font-semibold text-neutral-950 transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950"
        >
          +1 rep
        </button>
      </div>

      <div className="border-t border-neutral-800 px-6 py-4 text-center text-sm text-neutral-500">
        <kbd className="rounded border border-neutral-700 bg-neutral-900 px-2 py-0.5 font-mono text-xs text-neutral-300">
          Space
        </kbd>{" "}
        add rep ·{" "}
        <kbd className="rounded border border-neutral-700 bg-neutral-900 px-2 py-0.5 font-mono text-xs text-neutral-300">
          Esc
        </kbd>{" "}
        exit
      </div>
    </div>
  );
}
