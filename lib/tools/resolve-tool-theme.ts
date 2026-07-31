import type { ToolConfig } from "@/lib/tool-engine/schema/tool-config";
import { getThemeForCluster, type ClusterTheme } from "./cluster-themes";

export function resolveToolTheme(config: ToolConfig): ClusterTheme {
  const clusterTheme = getThemeForCluster(config.taxonomy.cluster);
  const accentOverride = config.theme?.accentColor;

  if (!accentOverride) {
    return clusterTheme;
  }

  return {
    ...clusterTheme,
    accent: accentOverride,
    secondary: accentOverride,
  };
}

export function resolveThemeColor(config: ToolConfig): string {
  return resolveToolTheme(config).accent;
}
