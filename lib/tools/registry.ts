import type { ComponentType } from "react";
import type { ToolMetadata, ToolPageProps } from "@/types/tool";
import {
  configToMetadata,
  getConfigBySlug,
  getAllConfigSlugs,
} from "@/lib/tool-engine/compiler/manifest";

export type { ToolPageProps };

export type ToolComponent = ComponentType<ToolPageProps>;

export interface ComponentToolRegistration extends ToolMetadata {
  kind: "component";
  load: () => Promise<{ default: ToolComponent }>;
}

export interface ConfigToolRegistration {
  kind: "config";
  slug: string;
}

export type ToolRegistration = ComponentToolRegistration | ConfigToolRegistration;

function buildConfigRegistrations(): ConfigToolRegistration[] {
  return getAllConfigSlugs().map((slug) => ({ kind: "config" as const, slug }));
}

export const toolRegistrations: ToolRegistration[] = buildConfigRegistrations();

export function getAllToolRegistrations(): ToolRegistration[] {
  return toolRegistrations.filter((tool) => {
    const config = getConfigBySlug(tool.slug);
    return config && config.status === "published";
  });
}

export function getToolRegistration(
  slug: string,
): ToolRegistration | undefined {
  return getAllToolRegistrations().find((tool) => tool.slug === slug);
}

export function getToolMetadata(slug: string): ToolMetadata | undefined {
  const registration = getToolRegistration(slug);
  if (!registration) return undefined;

  const config = getConfigBySlug(slug);
  return config ? configToMetadata(config) : undefined;
}

export function getToolBySlug(slug: string): ToolMetadata | undefined {
  return getToolMetadata(slug);
}

export function getAllToolSlugs(): string[] {
  return getAllToolRegistrations().map((tool) => tool.slug);
}

export function isConfigTool(slug: string): boolean {
  return getToolRegistration(slug)?.kind === "config";
}

export async function loadToolComponent(
  slug: string,
): Promise<ToolComponent | null> {
  const registration = getToolRegistration(slug);
  if (!registration || registration.kind !== "component") return null;
  const loaded = await registration.load();
  return loaded.default;
}
