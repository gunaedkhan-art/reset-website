import type { Metadata } from "next";
import { PageHeading } from "@/components/ui/PageHeading";
import { Section } from "@/components/ui/Section";
import { createMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = createMetadata({
  title: "Terms of Service",
  description: `Terms of service for using ${siteConfig.name} tools and website.`,
  path: "/terms",
});

export default function TermsPage() {
  return (
    <>
      <Section spacing="md" className="border-b border-neutral-100 bg-neutral-50/50">
        <PageHeading
          title="Terms of Service"
          description={`Last updated: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`}
        />
      </Section>

      <Section spacing="md">
        <article className="prose mx-auto max-w-3xl">
          <p>
            By accessing or using {siteConfig.name}, you agree to these Terms
            of Service. If you do not agree, please do not use our services.
          </p>

          <h2>Use of services</h2>
          <p>
            Our tools are provided free of charge for personal and commercial
            use, unless otherwise stated. You agree to use the services lawfully
            and not to misuse, reverse engineer, or disrupt the platform.
          </p>

          <h2>No warranty</h2>
          <p>
            Tools and content are provided &quot;as is&quot; without warranties of
            any kind. We do not guarantee accuracy, completeness, or fitness for
            a particular purpose. Always verify critical calculations and
            decisions independently.
          </p>

          <h2>Limitation of liability</h2>
          <p>
            To the fullest extent permitted by law, {siteConfig.name} and its
            contributors shall not be liable for any indirect, incidental,
            special, or consequential damages arising from your use of the
            services.
          </p>

          <h2>Intellectual property</h2>
          <p>
            The {siteConfig.name} name, logo, design, and original content are
            protected by applicable intellectual property laws. You may not copy
            or redistribute our branding without permission.
          </p>

          <h2>User content</h2>
          <p>
            If you submit content (e.g., via contact forms), you grant us a
            non-exclusive license to use it for responding and improving our
            services.
          </p>

          <h2>Termination</h2>
          <p>
            We may suspend or terminate access to our services at any time for
            violations of these terms or for operational reasons.
          </p>

          <h2>Changes</h2>
          <p>
            We may modify these terms at any time. Material changes will be
            reflected on this page with an updated date.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about these terms? Contact{" "}
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
          </p>
        </article>
      </Section>
    </>
  );
}
