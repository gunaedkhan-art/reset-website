import type { Metadata } from "next";
import {
  getConfigBySlug,
  getConfigByUrlSlug,
} from "@/lib/tool-engine/compiler/manifest";
import { createMetadata } from "@/lib/seo";
import { getToolMetadata } from "./registry";

export function resolveRegistrySlug(urlSlug: string): string | undefined {
  const config = getConfigByUrlSlug(urlSlug);
  if (config) return config.slug;
  if (getToolMetadata(urlSlug)) return urlSlug;
  return undefined;
}

export function getToolCanonicalPath(slug: string): string {
  const config = getConfigBySlug(slug);
  return config?.seo.canonicalPath ?? `/tools/${slug}`;
}

export function buildToolPageMetadata(urlSlug: string): Metadata {
  const registrySlug = resolveRegistrySlug(urlSlug);

  if (!registrySlug) {
    return createMetadata({
      title: "Tool not found",
      description: "The requested tool could not be found.",
      path: `/${urlSlug}`,
      noIndex: true,
    });
  }

  const config = getConfigBySlug(registrySlug);
  const metadata = getToolMetadata(registrySlug);

  if (!metadata) {
    return createMetadata({
      title: "Tool not found",
      description: "The requested tool could not be found.",
      path: `/${urlSlug}`,
      noIndex: true,
    });
  }

  return createMetadata({
    title: config?.seo.title ?? metadata.title,
    description: config?.seo.metaDescription ?? metadata.description,
    path: config?.seo.canonicalPath ?? getToolCanonicalPath(registrySlug),
    keywords: config
      ? [config.seo.primaryKeyword, ...config.seo.secondaryKeywords]
      : metadata.keywords,
  });
}
