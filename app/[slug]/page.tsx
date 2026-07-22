import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolPageLoader } from "@/components/tool/ToolPageLoader";
import { ToolPageSkeleton } from "@/components/tool/ToolPageSkeleton";
import { getAllToolUrlSlugs } from "@/lib/tool-engine/compiler/manifest";
import {
  buildToolPageMetadata,
  resolveRegistrySlug,
} from "@/lib/tools/tool-page";
import {
  getCategoryBySlug,
  getRelatedTools,
  getToolMetadata,
} from "@/lib/tools";

interface IntentToolPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllToolUrlSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: IntentToolPageProps): Promise<Metadata> {
  const { slug } = await params;
  return buildToolPageMetadata(slug);
}

export default async function IntentToolPage({ params }: IntentToolPageProps) {
  const { slug } = await params;
  const registrySlug = resolveRegistrySlug(slug);

  if (!registrySlug) {
    notFound();
  }

  const metadata = getToolMetadata(registrySlug);

  if (!metadata) {
    notFound();
  }

  const category = getCategoryBySlug(metadata.category);
  const relatedTools = getRelatedTools(registrySlug);

  return (
    <Suspense fallback={<ToolPageSkeleton title={metadata.title} />}>
      <ToolPageLoader
        slug={registrySlug}
        metadata={metadata}
        relatedTools={relatedTools}
        categoryName={category?.name}
      />
    </Suspense>
  );
}
