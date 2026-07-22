import type { Metadata } from "next";
import { CTACard } from "@/components/ui/CTACard";
import { InfoCard } from "@/components/ui/InfoCard";
import { PageHeading } from "@/components/ui/PageHeading";
import { Section } from "@/components/ui/Section";
import { createMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = createMetadata({
  title: siteConfig.app.name,
  description: siteConfig.app.description,
  path: "/app",
  keywords: ["productivity app", "focus app", "mobile app"],
});

export default function AppPage() {
  return (
    <>
      <Section spacing="md" className="border-b border-neutral-100 bg-neutral-50/50">
        <PageHeading
          eyebrow="Mobile"
          title={siteConfig.app.name}
          description={siteConfig.app.description}
          align="center"
        />
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href={siteConfig.app.iosUrl}
            className="inline-flex h-12 items-center justify-center rounded-xl bg-neutral-900 px-6 text-sm font-medium text-white transition-colors hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
            aria-label="Download on the App Store"
          >
            App Store
          </a>
          <a
            href={siteConfig.app.androidUrl}
            className="inline-flex h-12 items-center justify-center rounded-xl border border-neutral-200 bg-white px-6 text-sm font-medium text-neutral-900 transition-colors hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
            aria-label="Get it on Google Play"
          >
            Google Play
          </a>
        </div>
        <p className="mx-auto mt-6 max-w-md text-center text-sm text-neutral-500">
          Store links are placeholders — update URLs in{" "}
          <code className="rounded bg-neutral-200/60 px-1.5 py-0.5 text-xs">
            lib/site.ts
          </code>{" "}
          when your app launches.
        </p>
      </Section>

      <Section spacing="md">
        <ul className="grid gap-6 sm:grid-cols-3">
          {[
            {
              title: "Sync across devices",
              description:
                "Save preferences and recent tool results wherever you work.",
            },
            {
              title: "Offline mode",
              description:
                "Access essential tools without a connection.",
            },
            {
              title: "Focus sessions",
              description:
                "Built-in timers and distraction blocking for deep work.",
            },
          ].map((feature) => (
            <li key={feature.title}>
              <InfoCard title={feature.title} description={feature.description} />
            </li>
          ))}
        </ul>
      </Section>

      <Section spacing="md">
        <CTACard
          title="Prefer the web?"
          description="All tools are available free in your browser — no download required."
          primaryAction={{ label: "Browse web tools", href: "/tools" }}
        />
      </Section>
    </>
  );
}
