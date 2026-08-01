"use client";

import Link from "next/link";
import { trackEvent } from "@/lib/analytics/track-client";

interface ClusterHubPillarLinkProps {
  hubSlug: string;
  toolSlug: string;
  href: string;
  className?: string;
  children: React.ReactNode;
}

export function ClusterHubPillarLink({
  hubSlug,
  toolSlug,
  href,
  className,
  children,
}: ClusterHubPillarLinkProps) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() => {
        trackEvent({
          name: "cluster_hub_pillar_click",
          hub_slug: hubSlug,
          tool_slug: toolSlug,
        });
      }}
    >
      {children}
    </Link>
  );
}
