import Link from "next/link";
import { ToolClusterHero } from "@/components/tool/ToolClusterHero";
import { ToolIconForConfig } from "@/components/tool/ToolIcon";
import { InfoCard } from "@/components/ui/InfoCard";
import { PageHeading } from "@/components/ui/PageHeading";
import { Section } from "@/components/ui/Section";
import { getConfigBySlug } from "@/lib/tool-engine/compiler/manifest";
import {
  clusterThemes,
  getCategoryBySlug,
  getToolCanonicalPath,
  getToolsForClusterHub,
  type ToolClusterHub,
} from "@/lib/tools";
import { resolveToolTheme } from "@/lib/tools/resolve-tool-theme";

interface ToolClusterHubViewProps {
  hub: ToolClusterHub;
}

export function ToolClusterHubView({ hub }: ToolClusterHubViewProps) {
  const theme = clusterThemes[hub.themeId];
  const tools = getToolsForClusterHub(hub.clusters);
  const pillar = getConfigBySlug(hub.pillarSlug);
  const supporting = tools.filter((tool) => tool.slug !== hub.pillarSlug);

  return (
    <>
      <Section spacing="md" className="border-b border-neutral-100 bg-neutral-50/50">
        <ToolClusterHero theme={theme} icon="blocks" title={hub.name} />
        <PageHeading
          eyebrow="Tool collection"
          title={hub.name}
          description={hub.description}
        />
        {pillar && (
          <div className="mt-8">
            <p className="mb-3 text-sm font-semibold text-neutral-900">Start here</p>
            <InfoCard
              title={pillar.content.h1}
              description={pillar.content.intro}
              href={pillar.seo.canonicalPath}
              eyebrow="Recommended entry point"
              icon={
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{
                    backgroundColor: theme.muted,
                    color: theme.primary,
                  }}
                >
                  <ToolIconForConfig config={pillar} size={20} />
                </div>
              }
            />
          </div>
        )}
      </Section>

      <Section spacing="md">
        <h2 className="mb-4 text-xl font-semibold text-neutral-900">All tools in this collection</h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {supporting.map((tool) => {
            const config = getConfigBySlug(tool.slug);
            const toolTheme = config ? resolveToolTheme(config) : theme;
            const category = getCategoryBySlug(tool.category);
            return (
              <li key={tool.slug}>
                <InfoCard
                  title={tool.title}
                  description={tool.description}
                  href={getToolCanonicalPath(tool.slug)}
                  eyebrow={category?.name}
                  icon={
                    config ? (
                      <div
                        className="flex h-10 w-10 items-center justify-center rounded-xl"
                        style={{
                          backgroundColor: toolTheme.muted,
                          color: toolTheme.primary,
                        }}
                      >
                        <ToolIconForConfig config={config} size={20} />
                      </div>
                    ) : undefined
                  }
                />
              </li>
            );
          })}
        </ul>

        <p className="mt-10 text-sm text-neutral-600">
          <Link href="/tools" className="font-medium text-neutral-900 underline">
            Browse all tools
          </Link>
          {" · "}
          Explore other collections:{" "}
          {["deep-work", "procrastination", "phone-and-focus", "one-thing", "money"]
            .filter((slug) => slug !== hub.slug)
            .map((slug, index, arr) => (
              <span key={slug}>
                <Link href={`/tools/${slug}`} className="font-medium text-neutral-900 underline">
                  {slug.replace(/-/g, " ")}
                </Link>
                {index < arr.length - 1 ? ", " : ""}
              </span>
            ))}
        </p>
      </Section>
    </>
  );
}
