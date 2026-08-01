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
  noIndex: true,
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
        <p className="mx-auto mt-10 max-w-md text-center text-sm text-neutral-600">
          The {siteConfig.app.name} is coming soon. All tools are available free in
          your browser today on {siteConfig.name}.
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
