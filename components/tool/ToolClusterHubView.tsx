import Link from "next/link";
import { ActiveTrackersSection } from "@/components/home/ActiveTrackersSection";
import { ThemedToolIconBadge } from "@/components/tool/ThemedToolIconBadge";
import { ToolClusterHero } from "@/components/tool/ToolClusterHero";
import { ToolIconForConfig, getToolIconName } from "@/components/tool/ToolIcon";
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
import {
  getClusterJourney,
  isRepeatUseTool,
} from "@/lib/tools/cluster-journeys";
import { resolveToolTheme } from "@/lib/tools/resolve-tool-theme";

interface ToolClusterHubViewProps {
  hub: ToolClusterHub;
}

export function ToolClusterHubView({ hub }: ToolClusterHubViewProps) {
  const theme = clusterThemes[hub.themeId];
  const tools = getToolsForClusterHub(hub.clusters);
  const pillar = getConfigBySlug(hub.pillarSlug);
  const journey = getClusterJourney(hub.slug);
  const journeySlugs = new Set(journey?.steps.map((step) => step.slug) ?? []);
  const supporting = tools
    .filter((tool) => tool.slug !== hub.pillarSlug)
    .sort((a, b) => {
      const aRepeat = isRepeatUseTool(a.slug) ? 0 : 1;
      const bRepeat = isRepeatUseTool(b.slug) ? 0 : 1;
      if (aRepeat !== bRepeat) return aRepeat - bRepeat;
      return a.title.localeCompare(b.title);
    });

  return (
    <>
      <Section spacing="md" className="border-b border-neutral-100 bg-neutral-50/50">
        <ToolClusterHero
          theme={theme}
          icon={pillar ? getToolIconName(pillar) : "blocks"}
          title={hub.name}
        />
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
                <ThemedToolIconBadge theme={theme}>
                  <ToolIconForConfig config={pillar} size={20} />
                </ThemedToolIconBadge>
              }
            />
          </div>
        )}
      </Section>

      <ActiveTrackersSection />

      {journey && (
        <Section spacing="md" className="border-b border-neutral-100 bg-white">
          <h2 className="text-xl font-semibold text-neutral-900">{journey.title}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-neutral-600">
            {journey.description}
          </p>
          <ol className="mt-6 space-y-3">
            {journey.steps.map((step, index) => {
              const config = getConfigBySlug(step.slug);
              const stepTheme = config ? resolveToolTheme(config) : theme;
              const href = getToolCanonicalPath(step.slug);
              return (
                <li key={step.slug}>
                  <Link
                    href={href}
                    className="group flex gap-4 rounded-xl border border-neutral-200 bg-neutral-50/60 p-4 transition-colors hover:border-neutral-300 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
                  >
                    <span
                      aria-hidden="true"
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
                      style={{ backgroundColor: theme.primary }}
                    >
                      {index + 1}
                    </span>
                    {config && (
                      <ThemedToolIconBadge theme={stepTheme}>
                        <ToolIconForConfig config={config} size={20} />
                      </ThemedToolIconBadge>
                    )}
                    <span className="min-w-0 flex-1 space-y-1">
                      <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="font-semibold text-neutral-900 group-hover:text-neutral-950">
                          {step.title}
                        </span>
                        {step.repeatUse && (
                          <span className="rounded-full bg-sky-50 px-2 py-0.5 text-xs font-medium text-sky-900">
                            Repeat-use
                          </span>
                        )}
                      </span>
                      <span className="block text-sm leading-relaxed text-neutral-600">
                        {step.description}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        </Section>
      )}

      <Section spacing="md">
        <h2 className="mb-4 text-xl font-semibold text-neutral-900">
          All tools in this collection
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {supporting.map((tool) => {
            const config = getConfigBySlug(tool.slug);
            const toolTheme = config ? resolveToolTheme(config) : theme;
            const category = getCategoryBySlug(tool.category);
            const inJourney = journeySlugs.has(tool.slug);
            const eyebrow = isRepeatUseTool(tool.slug)
              ? "Repeat-use tracker"
              : inJourney
                ? "On the path"
                : category?.name;
            return (
              <li key={tool.slug}>
                <InfoCard
                  title={tool.title}
                  description={tool.description}
                  href={getToolCanonicalPath(tool.slug)}
                  eyebrow={eyebrow}
                  icon={
                    config ? (
                      <ThemedToolIconBadge theme={toolTheme}>
                        <ToolIconForConfig config={config} size={20} />
                      </ThemedToolIconBadge>
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
