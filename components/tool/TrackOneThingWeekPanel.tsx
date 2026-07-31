"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/Input";
import { setOneThingPrefill } from "@/lib/one-thing-weekly/prefill";
import { trackEvent } from "@/lib/analytics/track-client";

export interface TrackOneThingWeekPanelProps {
  toolSlug: string;
  suggestedOneThing?: string;
  suggestedLeadDomino?: string;
}

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

  const handleTrack = () => {
    const trimmed = oneThing.trim();
    if (!trimmed) {
      setError("Write your ONE Thing for the week first.");
      return;
    }

    setError(null);
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
        <button
          type="button"
          onClick={handleTrack}
          className="inline-flex h-11 items-center justify-center rounded-xl bg-neutral-900 px-5 text-sm font-medium text-white transition-colors hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
        >
          Start weekly check-ins
        </button>
      </div>
    </div>
  );
}
