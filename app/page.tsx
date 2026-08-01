import Link from "next/link";
import { ActiveTrackersSection } from "@/components/home/ActiveTrackersSection";
import {
  CategoryBrowseCard,
  ClusterHubCard,
  ThemedToolIconBadge,
} from "@/components/tool";
import { ToolIconForConfig } from "@/components/tool/ToolIcon";
import { CTACard } from "@/components/ui/CTACard";
import { InfoCard } from "@/components/ui/InfoCard";
import { PageHeading } from "@/components/ui/PageHeading";
import { Section } from "@/components/ui/Section";
import { getConfigBySlug } from "@/lib/tool-engine/compiler/manifest";
import { siteConfig } from "@/lib/site";
import {
  clusterThemes,
  getCategoryBySlug,
  getFeaturedTools,
  getToolCanonicalPath,
  resolveToolTheme,
  toolCategories,
  toolClusterHubs,
} from "@/lib/tools";

export default function HomePage() {
  const featuredTools = getFeaturedTools(6);
  const siteTheme = clusterThemes.default;

  return (
    <>
      <Section
        spacing="lg"
        className="border-b border-neutral-100"
        style={{
          background: `linear-gradient(180deg, ${siteTheme.heroFrom} 0%, white 70%)`,
        }}
      >
        <PageHeading
          eyebrow="Free online tools"
          title="Work smarter with simple, fast tools"
          description={`${siteConfig.name} is building a library of free productivity, focus, and planning tools — designed to load instantly, work on any device, and stay out of your way.`}
          align="center"
        />
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/tools"
            className="inline-flex h-12 items-center justify-center rounded-xl px-6 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            style={{
              backgroundColor: siteTheme.primary,
              color: siteTheme.onPrimary,
            }}
          >
            Browse tools
          </Link>
          <Link
            href="/about"
            className="inline-flex h-12 items-center justify-center rounded-xl border border-neutral-200 bg-white px-6 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
          >
            Learn more
          </Link>
        </div>
      </Section>

      <ActiveTrackersSection />

      <Section spacing="md" className="border-b border-neutral-100 bg-neutral-50/50">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">
            Collections
          </h2>
          <p className="mt-2 max-w-2xl text-neutral-600">
            Browse by topic — each collection links to a dedicated hub with related
            calculators and planners.
          </p>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {toolClusterHubs.map((hub) => (
            <li key={hub.slug}>
              <ClusterHubCard
                hub={hub}
                pillarConfig={getConfigBySlug(hub.pillarSlug)}
              />
            </li>
          ))}
        </ul>
      </Section>

      {featuredTools.length > 0 && (
        <Section spacing="md" className="border-b border-neutral-100">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">
                Popular tools
              </h2>
              <p className="mt-2 max-w-2xl text-neutral-600">
                Interactive guides and calculators — free, no signup required.
              </p>
            </div>
            <Link
              href="/tools"
              className="text-sm font-medium transition-colors hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{ color: siteTheme.primary }}
            >
              View all tools →
            </Link>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredTools.map((tool) => {
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
        </Section>
      )}

      <Section spacing="md" className="bg-neutral-50/80">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-900">
            Tool categories
          </h2>
          <p className="mt-2 text-neutral-600">
            Browse by topic to find the right tool for what you need today.
          </p>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {toolCategories.map((category) => (
            <li key={category.slug}>
              <CategoryBrowseCard
                slug={category.slug}
                name={category.name}
                description={category.description}
                href={`/tools?category=${category.slug}`}
              />
            </li>
          ))}
        </ul>
      </Section>

      {siteConfig.features.showAppDownload ? (
        <Section spacing="md">
          <CTACard
            variant="dark"
            title={`Take ${siteConfig.name} everywhere`}
            description={`The ${siteConfig.app.name} brings your favorite tools offline, with sync and focus modes built in.`}
            primaryAction={{ label: "Download the app", href: "/app" }}
            secondaryAction={{ label: "Contact us", href: "/contact" }}
          />
        </Section>
      ) : (
        <Section spacing="md">
          <CTACard
            variant="dark"
            title="More tools on the way"
            description="We're building new productivity and focus tools every week. Browse what's live or get in touch."
            primaryAction={{ label: "Browse tools", href: "/tools" }}
            secondaryAction={{ label: "Contact us", href: "/contact" }}
          />
        </Section>
      )}
    </>
  );
}
