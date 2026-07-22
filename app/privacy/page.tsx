import type { Metadata } from "next";
import { PageHeading } from "@/components/ui/PageHeading";
import { Section } from "@/components/ui/Section";
import { createMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = createMetadata({
  title: "Privacy Policy",
  description: `Privacy policy for ${siteConfig.name}. Learn how we handle data across our tools and website.`,
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <Section spacing="md" className="border-b border-neutral-100 bg-neutral-50/50">
        <PageHeading
          title="Privacy Policy"
          description={`Last updated: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`}
        />
      </Section>

      <Section spacing="md">
        <article className="prose mx-auto max-w-3xl">
          <p>
            {siteConfig.name} (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is
            committed to protecting your privacy. This policy explains what
            information we collect, how we use it, and your choices.
          </p>

          <h2>Information we collect</h2>
          <p>
            Most tools run entirely in your browser and do not require an
            account. We may collect:
          </p>
          <ul>
            <li>Anonymous usage analytics (page views, tool usage patterns)</li>
            <li>Information you voluntarily submit via contact or newsletter forms</li>
            <li>Standard server logs (IP address, browser type, timestamps)</li>
          </ul>

          <h2>How we use information</h2>
          <ul>
            <li>Improve and maintain our tools and website</li>
            <li>Respond to inquiries and support requests</li>
            <li>Send newsletters if you opt in</li>
            <li>Protect against abuse and ensure security</li>
          </ul>

          <h2>Cookies</h2>
          <p>
            We may use essential and analytics cookies. You can control cookies
            through your browser settings. Disabling cookies may affect some
            features.
          </p>

          <h2>Third-party services</h2>
          <p>
            We may use third-party analytics, hosting, and email providers.
            These services have their own privacy policies governing their use
            of your data.
          </p>

          <h2>Data retention</h2>
          <p>
            We retain information only as long as necessary for the purposes
            described in this policy, unless a longer period is required by law.
          </p>

          <h2>Your rights</h2>
          <p>
            Depending on your location, you may have rights to access, correct,
            delete, or export your personal data. Contact us at{" "}
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a> to
            exercise these rights.
          </p>

          <h2>Changes</h2>
          <p>
            We may update this policy from time to time. Continued use of the
            site after changes constitutes acceptance of the updated policy.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about this policy? Email{" "}
            <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
          </p>
        </article>
      </Section>
    </>
  );
}
