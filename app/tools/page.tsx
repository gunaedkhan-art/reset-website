import type { Metadata } from "next";
import Link from "next/link";
import { Callout } from "@/components/ui/Callout";
import { InfoCard } from "@/components/ui/InfoCard";
import { Input } from "@/components/ui/Input";
import { PageHeading } from "@/components/ui/PageHeading";
import { Section } from "@/components/ui/Section";
import { createMetadata } from "@/lib/seo";
import {
  getAllTools,
  getCategoryBySlug,
  getToolCanonicalPath,
  getToolsByCategory,
  searchTools,
  toolCategories,
} from "@/lib/tools";
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
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => {
              const category = getCategoryBySlug(tool.category);
              return (
                <li key={tool.slug}>
                  <InfoCard
                    title={tool.title}
                    description={tool.description}
                    href={getToolCanonicalPath(tool.slug)}
                    eyebrow={category?.name}
                  />
                </li>
              );
            })}
          </ul>
        )}
      </Section>
    </>
  );
}
