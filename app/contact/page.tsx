import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PageHeading } from "@/components/ui/PageHeading";
import { Section } from "@/components/ui/Section";
import { Textarea } from "@/components/ui/Textarea";
import { createMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = createMetadata({
  title: "Contact",
  description: `Get in touch with the ${siteConfig.name} team. Questions, feedback, and partnership inquiries welcome.`,
  path: "/contact",
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

          <form
            className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8"
            action="#"
            aria-label="Contact form placeholder"
          >
            <div className="space-y-5">
              <Input label="Name" name="name" required autoComplete="name" />
              <Input
                label="Email"
                name="email"
                type="email"
                required
                autoComplete="email"
              />
              <Textarea
                label="Message"
                name="message"
                required
                rows={5}
                placeholder="How can we help?"
              />
              <Button type="submit" fullWidth>
                Send message
              </Button>
              <p className="text-xs text-neutral-500">
                Placeholder form — connect to your backend or form service when
                ready.
              </p>
            </div>
          </form>
        </div>
      </Section>
    </>
  );
}
