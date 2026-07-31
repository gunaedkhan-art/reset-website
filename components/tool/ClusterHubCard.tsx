import Link from "next/link";
import { ToolIconForConfig } from "@/components/tool/ToolIcon";
import { clusterThemes } from "@/lib/tools/cluster-themes";
import type { ToolClusterHub } from "@/lib/tools/cluster-hubs";
import type { ToolConfig } from "@/lib/tool-engine/schema/tool-config";

export interface ClusterHubCardProps {
  hub: ToolClusterHub;
  pillarConfig?: ToolConfig | null;
}

/** Collection hub card with cluster gradient and pillar icon — used on home and tools hub. */
export function ClusterHubCard({ hub, pillarConfig }: ClusterHubCardProps) {
  const theme = clusterThemes[hub.themeId];

  return (
    <Link
      href={`/tools/${hub.slug}`}
      className="group flex h-full flex-col rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition-colors hover:border-neutral-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
      style={{
        background: `linear-gradient(160deg, ${theme.heroFrom} 0%, white 55%)`,
      }}
    >
      <div
        className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl"
        style={{
          backgroundColor: theme.primary,
          color: theme.onPrimary,
        }}
      >
        {pillarConfig ? <ToolIconForConfig config={pillarConfig} size={20} /> : null}
      </div>
      <span className="font-semibold text-neutral-900 group-hover:text-neutral-950">
        {hub.name}
      </span>
      <span className="mt-1 text-sm leading-relaxed text-neutral-600">{hub.description}</span>
    </Link>
  );
}
