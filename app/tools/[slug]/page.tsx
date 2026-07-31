import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { ToolClusterHubView } from "@/components/tool/ToolClusterHubView";
import { createMetadata } from "@/lib/seo";
import { getConfigBySlug } from "@/lib/tool-engine/compiler/manifest";
import {
  getAllClusterHubSlugs,
  getAllToolSlugs,
  getClusterHub,
  isClusterHubSlug,
} from "@/lib/tools";

interface ToolsSlugPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const toolSlugs = getAllToolSlugs();
  const hubSlugs = getAllClusterHubSlugs();
  const slugs = new Set([...toolSlugs, ...hubSlugs]);
  return [...slugs].map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ToolsSlugPageProps): Promise<Metadata> {
  const { slug } = await params;

  if (isClusterHubSlug(slug)) {
    const hub = getClusterHub(slug)!;
    return createMetadata({
      title: hub.name,
      description: hub.metaDescription,
      path: `/tools/${hub.slug}`,
      keywords: [hub.name, "free tools", hub.slug.replace(/-/g, " ")],
    });
  }

  const config = getConfigBySlug(slug);
  if (!config) {
    return createMetadata({
      title: "Tools",
      description: "Browse free productivity tools.",
      path: "/tools",
    });
  }

  return createMetadata({
    title: config.seo.title,
    description: config.seo.metaDescription,
    path: config.seo.canonicalPath,
    keywords: [config.seo.primaryKeyword, ...config.seo.secondaryKeywords],
  });
}

/** Cluster hub pages at `/tools/[hub-slug]` or 301 redirect legacy tool URLs. */
export default async function ToolsSlugPage({ params }: ToolsSlugPageProps) {
  const { slug } = await params;

  if (isClusterHubSlug(slug)) {
    const hub = getClusterHub(slug);
    if (!hub) notFound();
    return <ToolClusterHubView hub={hub} />;
  }

  const config = getConfigBySlug(slug);
  if (!config) {
    notFound();
  }

  permanentRedirect(config.seo.canonicalPath);
}
