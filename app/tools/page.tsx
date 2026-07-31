import type { Metadata } from "next";
import Link from "next/link";
import { ActiveTrackersSection } from "@/components/home/ActiveTrackersSection";
import { ClusterHubCard, ThemedToolIconBadge } from "@/components/tool";
import { ToolIconForConfig } from "@/components/tool/ToolIcon";
import { Callout } from "@/components/ui/Callout";
import { InfoCard } from "@/components/ui/InfoCard";
import { Input } from "@/components/ui/Input";
import { PageHeading } from "@/components/ui/PageHeading";
import { Section } from "@/components/ui/Section";
import { getConfigBySlug } from "@/lib/tool-engine/compiler/manifest";
import { createMetadata } from "@/lib/seo";
import {
  getAllTools,
  getCategoryBySlug,
  getRecommendedStarterTools,
  getToolCanonicalPath,
  getToolsByCategory,
  searchTools,
  toolCategories,
  toolClusterHubs,
} from "@/lib/tools";
import { resolveToolTheme } from "@/lib/tools/resolve-tool-theme";
import { cn } from "@/lib/utils";

interface ToolsPageProps {
  searchParams: Promise<{ category?: string; q?: string }>;
}

export async function generateMetadata({
  searchParams,
}: ToolsPageProps): Promise<Metadata> {
  const { category, q } = await searchParams;
  const hasFilters = Boolean(category || q?.trim());

  return createMetadata({
    title: "Tools",
    description:
      "Browse free productivity, focus, planning, and calculator tools. Fast, accessible, and always free.",
    path: "/tools",
    keywords: ["free tools", "productivity", "focus", "planning", "calculators"],
    noIndex: hasFilters,
  });
}

function buildToolsUrl(options: { category?: string; q?: string }): string {
  const params = new URLSearchParams();
  if (options.category) params.set("category", options.category);
  if (options.q?.trim()) params.set("q", options.q.trim());
  const query = params.toString();
  return query ? `/tools?${query}` : "/tools";
}

export default async function ToolsPage({ searchParams }: ToolsPageProps) {
  const { category: activeCategory, q: query = "" } = await searchParams;
  const validCategory = toolCategories.some((c) => c.slug === activeCategory)
    ? activeCategory
    : undefined;

  const baseTools = validCategory
    ? getToolsByCategory(validCategory)
    : getAllTools();

  const tools = searchTools(baseTools, query);

  const activeCategoryMeta = validCategory
    ? toolCategories.find((c) => c.slug === validCategory)
    : undefined;

  const trimmedQuery = query.trim();
  const hasSearch = trimmedQuery.length > 0;
  const showStarterGuide = !validCategory && !hasSearch;
  const starterTools = showStarterGuide ? getRecommendedStarterTools() : [];

  return (
    <>
      <Section spacing="md" className="border-b border-neutral-100 bg-neutral-50/50">
        <PageHeading
          eyebrow="Library"
          title={
            hasSearch
              ? `Search results`
              : activeCategoryMeta
                ? `${activeCategoryMeta.name} tools`
                : "All tools"
          }
          description={
            hasSearch
              ? `${tools.length} tool${tools.length === 1 ? "" : "s"} matching "${trimmedQuery}"`
              : (activeCategoryMeta?.description ??
                "A growing collection of free online tools for productivity, focus, and planning. New utilities are added regularly.")
          }
        />
      </Section>

      <ActiveTrackersSection />

      <Section spacing="md">
        <form
          action="/tools"
          method="get"
          className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end"
        >
          {validCategory && (
            <input type="hidden" name="category" value={validCategory} />
          )}
          <div className="flex-1">
            <Input
              label="Search tools"
              name="q"
              type="search"
              defaultValue={trimmedQuery}
              placeholder="e.g. procrastination, screen time, focus"
              autoComplete="off"
            />
          </div>
          <div className="flex shrink-0 gap-2">
            <button
              type="submit"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-neutral-900 px-5 text-sm font-medium text-white transition-colors hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
            >
              Search
            </button>
            {hasSearch && (
              <Link
                href={buildToolsUrl({ category: validCategory })}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-neutral-200 bg-white px-5 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
              >
                Clear
              </Link>
            )}
          </div>
        </form>

        <div className="mb-10">
          <h2 className="text-xl font-semibold text-neutral-900">Categories</h2>
          <p className="mt-1 text-sm text-neutral-600">
            Filter by category as the library grows.
          </p>
          <ul className="mt-4 flex flex-wrap gap-2">
            <li>
              <Link
                href={buildToolsUrl({ q: trimmedQuery })}
                className={cn(
                  "inline-flex rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  !validCategory
                    ? "bg-neutral-900 text-white"
                    : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200",
                )}
              >
                All
              </Link>
            </li>
            {toolCategories.map((category) => (
              <li key={category.slug}>
                <Link
                  href={buildToolsUrl({
                    category: category.slug,
                    q: trimmedQuery,
                  })}
                  className={cn(
                    "inline-flex rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    validCategory === category.slug
                      ? "bg-neutral-900 text-white"
                      : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200",
                  )}
                >
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {showStarterGuide && (
          <div className="mb-12">
            <h2 className="text-xl font-semibold text-neutral-900">Collections</h2>
            <p className="mt-1 max-w-3xl text-sm text-neutral-600">
              Browse tools by topic — each collection links to a dedicated hub with related
              calculators and planners.
            </p>
            <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {toolClusterHubs.map((hub) => (
                <li key={hub.slug}>
                  <ClusterHubCard
                    hub={hub}
                    pillarConfig={getConfigBySlug(hub.pillarSlug)}
                  />
                </li>
              ))}
            </ul>
          </div>
        )}

        {showStarterGuide && starterTools.length > 0 && (
          <div className="mb-12 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="text-xl font-semibold text-neutral-900">Start here</h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-neutral-600">
              New to Reset? These ten tools cover the most common jobs — focus now,
              pick a priority, triage your work, face phone and meeting costs, and
              plan savings. Each is the best entry point in its cluster, not a
              duplicate of similar tools below.
            </p>
            <ol className="mt-6 grid gap-4 lg:grid-cols-2">
              {starterTools.map((tool, index) => {
                const category = getCategoryBySlug(tool.category);
                const config = getConfigBySlug(tool.slug);
                const theme = config ? resolveToolTheme(config) : null;
                return (
                  <li key={tool.slug}>
                    <Link
                      href={getToolCanonicalPath(tool.slug)}
                      className="group flex h-full gap-4 rounded-xl border border-neutral-200 bg-neutral-50/60 p-4 transition-colors hover:border-neutral-300 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
                    >
                      <span
                        aria-hidden="true"
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
                        style={{
                          backgroundColor: theme?.primary ?? "#171717",
                        }}
                      >
                        {index + 1}
                      </span>
                      {config && (
                        <ThemedToolIconBadge theme={theme}>
                          <ToolIconForConfig config={config} size={20} />
                        </ThemedToolIconBadge>
                      )}
                      <span className="min-w-0 space-y-1">
                        <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                          <span className="font-semibold text-neutral-900 group-hover:text-neutral-950">
                            {tool.title}
                          </span>
                          {category && (
                            <span className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                              {category.name}
                            </span>
                          )}
                        </span>
                        <span className="block text-sm leading-relaxed text-neutral-600">
                          {tool.reason}
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </div>
        )}

        {tools.length === 0 ? (
          <Callout
            title={
              hasSearch
                ? "No matching tools"
                : validCategory
                  ? "No tools in this category yet"
                  : "Tools coming soon"
            }
          >
            {hasSearch ? (
              <>
                Nothing matched &quot;{trimmedQuery}&quot;.{" "}
                <Link href="/tools" className="font-medium text-neutral-900 underline">
                  Browse all tools
                </Link>
                .
              </>
            ) : validCategory ? (
              <>
                Nothing published in{" "}
                <strong>{activeCategoryMeta?.name}</strong> yet.{" "}
                <Link href="/tools" className="font-medium text-neutral-900 underline">
                  Browse all tools
                </Link>
                .
              </>
            ) : (
              <>Check back soon — new tools are added regularly.</>
            )}
          </Callout>
        ) : (
          <>
            {!showStarterGuide && (
              <h2 className="mb-4 text-xl font-semibold text-neutral-900">
                {hasSearch ? "Matching tools" : `${activeCategoryMeta?.name ?? "All"} tools`}
              </h2>
            )}
            {showStarterGuide && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-neutral-900">All tools</h2>
                <p className="mt-1 text-sm text-neutral-600">
                  Browse the full library of {tools.length} tools.
                </p>
              </div>
            )}
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => {
              const category = getCategoryBySlug(tool.category);
              const config = getConfigBySlug(tool.slug);
              const theme = config ? resolveToolTheme(config) : null;
              return (
                <li key={tool.slug}>
                  <InfoCard
                    title={tool.title}
                    description={tool.description}
                    href={getToolCanonicalPath(tool.slug)}
                    eyebrow={category?.name}
                    icon={
                      config ? (
                        <ThemedToolIconBadge theme={theme}>
                          <ToolIconForConfig config={config} size={20} />
                        </ThemedToolIconBadge>
                      ) : undefined
                    }
                  />
                </li>
              );
            })}
          </ul>
          </>
        )}
      </Section>
    </>
  );
}
