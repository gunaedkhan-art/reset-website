import type { Metadata } from "next";
import Link from "next/link";
import { CTACard } from "@/components/ui/CTACard";
import { PageHeading } from "@/components/ui/PageHeading";
import { Section } from "@/components/ui/Section";
import { createMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = createMetadata({
  title: "Contact",
  description: `Get in touch with the ${siteConfig.name} team. Questions, feedback, and partnership inquiries welcome.`,
  path: "/contact",
  noIndex: true,
});

export default function ContactPage() {
  return (
    <>
      <Section spacing="md" className="border-b border-neutral-100 bg-neutral-50/50">
        <PageHeading
          eyebrow="Reach out"
          title="Contact us"
          description="Have a question, tool suggestion, or partnership idea? We'd love to hear from you."
        />
      </Section>

      <Section spacing="md">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-neutral-900">Email</h2>
              <p className="mt-2 text-neutral-600">
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="underline underline-offset-2 hover:text-neutral-900"
                >
                  {siteConfig.email}
                </a>
              </p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-neutral-900">
                Response time
              </h2>
              <p className="mt-2 text-neutral-600">
                We typically respond within 2–3 business days.
              </p>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-neutral-900">
                Tool requests
              </h2>
              <p className="mt-2 text-neutral-600">
                Tell us what you need — our roadmap is shaped by user feedback.
              </p>
            </div>
          </div>

          <CTACard
            title="Send us an email"
            description="The fastest way to reach us. Include as much detail as you can — tool ideas, bug reports, or partnership proposals are all welcome."
            primaryAction={{
              label: `Email ${siteConfig.email}`,
              href: `mailto:${siteConfig.email}`,
            }}
            secondaryAction={{ label: "Browse tools", href: "/tools" }}
          />
        </div>

        <p className="mt-10 text-center text-sm text-neutral-600">
          Looking for free productivity tools?{" "}
          <Link
            href="/tools"
            className="font-medium text-primary underline-offset-2 hover:underline"
          >
            Browse the full library
          </Link>
          .
        </p>
      </Section>
    </>
  );
}
