"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics/track-client";
import { toolTheme, type ToolThemeColor } from "@/lib/tool-theme";
import { siteConfig } from "@/lib/site";
import { cn } from "@/lib/utils";
import { Section } from "@/components/ui/Section";
import { ToolContainer } from "./ToolContainer";

export interface ToolAppDownloadProps {
  title: string;
  description: string;
  themeColor?: ToolThemeColor;
  toolSlug?: string;
}

export function ToolAppDownload({
  title,
  description,
  themeColor = toolTheme.primary,
  toolSlug,
}: ToolAppDownloadProps) {
  return (
    <Section spacing="sm" aria-labelledby="tool-app-heading">
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
            id="tool-app-heading"
            className="text-xl font-semibold tracking-tight"
          >
            {title}
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-white/90">
            {description}
          </p>
          <div className="mt-6 flex justify-center">
            <Link
              href={siteConfig.app.androidUrl}
              onClick={() => {
                if (toolSlug) {
                  trackEvent({ name: "app_cta_click", tool_slug: toolSlug });
                }
              }}
              className="inline-flex h-11 items-center justify-center rounded-xl px-6 text-sm font-medium uppercase tracking-wide text-white transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--tool-theme)]"
              style={{ backgroundColor: toolTheme.downloadButton }}
              aria-label="Get Reset on Google Play"
            >
              Get it on Google Play
            </Link>
          </div>
        </div>
      </ToolContainer>
    </Section>
  );
}
