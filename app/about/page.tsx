import type { Metadata } from "next";
import { CTACard } from "@/components/ui/CTACard";
import { InfoCard } from "@/components/ui/InfoCard";
import { PageHeading } from "@/components/ui/PageHeading";
import { Section } from "@/components/ui/Section";
import { createMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = createMetadata({
  title: "About",
  description: siteConfig.description,
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <Section spacing="md" className="border-b border-neutral-100 bg-neutral-50/50">
        <PageHeading
          eyebrow="Our mission"
          title="Tools that respect your time"
          description={`${siteConfig.name} exists to give everyone access to high-quality productivity utilities — no accounts required, no clutter, no compromise on performance.`}
        />
      </Section>

      <Section spacing="md">
        <div className="prose mx-auto max-w-3xl">
          <p>
            We believe the best tools are invisible. They load instantly, work
            everywhere, and help you move forward without friction. {siteConfig.name}{" "}
            is building a library of focused utilities for productivity, planning,
            and everyday decisions — all free to use in your browser.
          </p>
        </div>

        <ul className="mt-12 grid gap-6 sm:grid-cols-3">
          {[
            {
              title: "Open & free",
              description: "Core tools stay free. No paywalls on essentials.",
            },
            {
              title: "Privacy first",
              description: "Tools run in your browser. We minimize data collection.",
            },
            {
              title: "Always improving",
              description: "Regular updates, new tools, and community feedback.",
            },
          ].map((item) => (
            <li key={item.title}>
              <InfoCard title={item.title} description={item.description} />
            </li>
          ))}
        </ul>
      </Section>

      <Section spacing="md">
        <CTACard
          title="Want to collaborate?"
          description="We're always looking for feedback, partnerships, and ideas for new tools."
          primaryAction={{ label: "Get in touch", href: "/contact" }}
          secondaryAction={{ label: "Browse tools", href: "/tools" }}
        />
      </Section>
    </>
  );
}
