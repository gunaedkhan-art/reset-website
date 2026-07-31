"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/Input";
import {
  buildTimeBlockUrl,
  setOneThingPrefill,
} from "@/lib/one-thing-weekly/prefill";
import { trackEvent } from "@/lib/analytics/track-client";

export interface TrackOneThingWeekPanelProps {
  toolSlug: string;
  suggestedOneThing?: string;
  suggestedLeadDomino?: string;
}

const secondaryButtonClass =
  "inline-flex h-11 items-center justify-center rounded-xl border border-neutral-200 bg-white px-5 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2";

/** Captures ONE Thing text and sends the user to the weekly check-in tracker. */
export function TrackOneThingWeekPanel({
  toolSlug,
  suggestedOneThing = "",
  suggestedLeadDomino = "",
}: TrackOneThingWeekPanelProps) {
  const router = useRouter();
  const [oneThing, setOneThing] = useState(suggestedOneThing);
  const [leadDomino, setLeadDomino] = useState(suggestedLeadDomino);
  const [error, setError] = useState<string | null>(null);

  const requireOneThing = (): string | null => {
    const trimmed = oneThing.trim();
    if (!trimmed) {
      setError("Write your ONE Thing for the week first.");
      return null;
    }
    setError(null);
    return trimmed;
  };

  const handleTrack = () => {
    const trimmed = requireOneThing();
    if (!trimmed) return;

    setOneThingPrefill({
      oneThing: trimmed,
      leadDomino: leadDomino.trim() || undefined,
      source: toolSlug,
    });
    trackEvent({
      name: "one_thing_weekly_prefill",
      tool_slug: toolSlug,
    });
    router.push("/one-thing-weekly-check-in");
  };

  const handleScheduleBlock = () => {
    const trimmed = requireOneThing();
    if (!trimmed) return;

    trackEvent({
      name: "one_thing_time_block_click",
      tool_slug: toolSlug,
      source: "track-panel",
    });
    router.push(buildTimeBlockUrl({ oneThing: trimmed }));
  };

  return (
    <div className="rounded-xl border border-sky-200 bg-sky-50/80 p-5">
      <h3 className="text-sm font-semibold text-sky-950">Track this week</h3>
      <p className="mt-1 text-sm leading-relaxed text-sky-900/90">
        Turn your ONE Thing into daily check-ins — yes, partial, or missed — with blocker
        tags and an end-of-week review.
      </p>
      <div className="mt-4 space-y-3">
        <Input
          id={`${toolSlug}-weekly-one-thing`}
          label="Your ONE Thing this week"
          value={oneThing}
          onChange={(event) => setOneThing(event.target.value)}
          placeholder="Finish the Q3 launch outline"
        />
        <Input
          id={`${toolSlug}-weekly-lead-domino`}
          label="Lead domino (optional)"
          value={leadDomino}
          onChange={(event) => setLeadDomino(event.target.value)}
          placeholder="Draft the opening section"
        />
        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <button
            type="button"
            onClick={handleTrack}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-neutral-900 px-5 text-sm font-medium text-white transition-colors hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
          >
            Start weekly check-ins
          </button>
          <button
            type="button"
            onClick={handleScheduleBlock}
            className={secondaryButtonClass}
          >
            Schedule your block
          </button>
        </div>
        <p className="text-xs leading-relaxed text-sky-900/75">
          Block time on your calendar first, then track whether you protected it each day.{" "}
          <Link
            href="/protect-your-one-thing-time-block"
            className="font-medium text-sky-950 underline-offset-2 hover:underline"
          >
            Time block calculator
          </Link>
        </p>
      </div>
    </div>
  );
}
