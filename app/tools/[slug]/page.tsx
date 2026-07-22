import { notFound, permanentRedirect } from "next/navigation";
import { getConfigBySlug } from "@/lib/tool-engine/compiler/manifest";
import { getAllToolSlugs } from "@/lib/tools";

interface LegacyToolPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllToolSlugs().map((slug) => ({ slug }));
}

/** 301 redirect legacy /tools/[slug] URLs to intent-first canonical paths. */
export default async function LegacyToolRedirect({
  params,
}: LegacyToolPageProps) {
  const { slug } = await params;
  const config = getConfigBySlug(slug);

  if (!config) {
    notFound();
  }

  permanentRedirect(config.seo.canonicalPath);
}
