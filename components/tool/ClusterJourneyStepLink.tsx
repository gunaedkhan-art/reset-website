"use client";

import Link from "next/link";
import { trackEvent } from "@/lib/analytics/track-client";

interface ClusterJourneyStepLinkProps {
  hubSlug: string;
  stepSlug: string;
  stepNumber: number;
  optional?: boolean;
  href: string;
  className?: string;
  children: React.ReactNode;
}

export function ClusterJourneyStepLink({
  hubSlug,
  stepSlug,
  stepNumber,
  optional = false,
  href,
  className,
  children,
}: ClusterJourneyStepLinkProps) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => {
        trackEvent({
          name: "cluster_journey_step_click",
          hub_slug: hubSlug,
          tool_slug: stepSlug,
          step_number: String(stepNumber),
          optional: optional ? "true" : "false",
        });
      }}
    >
      {children}
    </Link>
  );
}
