import Link from "next/link";
import { CTACard } from "@/components/ui/CTACard";
import { InfoCard } from "@/components/ui/InfoCard";
import { PageHeading } from "@/components/ui/PageHeading";
import { Section } from "@/components/ui/Section";
import { siteConfig } from "@/lib/site";
import {
  getCategoryBySlug,
  getFeaturedTools,
  getToolCanonicalPath,
  toolCategories,
} from "@/lib/tools";

export default function HomePage() {
  const featuredTools = getFeaturedTools(6);

  return (
    <>
      <Section spacing="lg" className="border-b border-neutral-100">
        <PageHeading
          eyebrow="Free online tools"
          title="Work smarter with simple, fast tools"
          description="Reset is building a library of free productivity, focus, and planning tools — designed to load instantly, work on any device, and stay out of your way."
          align="center"
        />
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/tools"
            className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-6 text-sm font-medium text-on-primary transition-colors hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
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

      {featuredTools.length > 0 && (
        <Section spacing="md" className="border-b border-neutral-100 bg-neutral-50/50">
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
              className="text-sm font-medium text-primary hover:text-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              View all tools →
            </Link>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredTools.map((tool) => {
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
              <InfoCard
                title={category.name}
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
            title="Take Reset everywhere"
            description="The Reset app brings your favorite tools offline, with sync and focus modes built in."
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
