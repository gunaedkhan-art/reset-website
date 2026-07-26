"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics/track-client";
import { toolTheme, type ToolThemeColor } from "@/lib/tool-theme";
import { cn } from "@/lib/utils";
import { Section } from "@/components/ui/Section";
import { ToolContainer } from "./ToolContainer";
import type { ToolGoalsCta as ToolGoalsCtaCopy } from "@/types/tool";

export interface ToolGoalsCtaProps {
  goalsCta: ToolGoalsCtaCopy;
  themeColor?: ToolThemeColor;
  toolSlug?: string;
}

export function ToolGoalsCta({
  goalsCta,
  themeColor = toolTheme.primary,
  toolSlug,
}: ToolGoalsCtaProps) {
  const trackClick = (target: "primary" | "secondary") => {
    if (toolSlug) {
      trackEvent({
        name: "goals_cta_click",
        tool_slug: toolSlug,
        target,
      });
    }
  };

  return (
    <Section spacing="sm" aria-labelledby="tool-goals-heading">
      <ToolContainer maxWidth="md">
        <div
          className={cn(
            "rounded-2xl p-6 text-center shadow-sm sm:p-8",
            "border border-[color-mix(in_srgb,var(--tool-theme)_80%,black)]",
          )}
          style={
            {
              "--tool-theme": themeColor,
              backgroundColor: themeColor,
              color: toolTheme.onPrimary,
            } as CSSProperties
          }
        >
          <h2
            id="tool-goals-heading"
            className="text-xl font-semibold tracking-tight"
          >
            {goalsCta.title}
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed opacity-80">
            {goalsCta.description}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={goalsCta.primaryHref}
              onClick={() => trackClick("primary")}
              className="inline-flex h-11 items-center justify-center rounded-xl px-6 text-sm font-medium uppercase tracking-wide text-white transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--tool-theme)]"
              style={{ backgroundColor: toolTheme.downloadButton }}
            >
              {goalsCta.primaryLabel}
            </Link>
            {goalsCta.secondaryHref && goalsCta.secondaryLabel && (
              <Link
                href={goalsCta.secondaryHref}
                onClick={() => trackClick("secondary")}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-white/40 px-6 text-sm font-medium uppercase tracking-wide text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--tool-theme)]"
              >
                {goalsCta.secondaryLabel}
              </Link>
            )}
          </div>
        </div>
      </ToolContainer>
    </Section>
  );
}
