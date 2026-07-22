"use client";

import { useState, type FormEvent } from "react";
import { trackEvent } from "@/lib/analytics/track-client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Section } from "@/components/ui/Section";
import { ToolContainer } from "./ToolContainer";

export interface ToolNewsletterSignupProps {
  title?: string;
  description?: string;
  toolSlug?: string;
}

export function ToolNewsletterSignup({
  title = "Stay in the loop",
  description = "Get new tools and productivity tips in your inbox. No spam, ever.",
  toolSlug,
}: ToolNewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(undefined);
    setLoading(true);

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          toolSlug,
          source: toolSlug ? "tool_page" : "site",
        }),
      });

      const data = (await response.json()) as { ok?: boolean; error?: string };

      if (!response.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setSuccess(true);
      trackEvent({
        name: "newsletter_signup",
        source: toolSlug ? "tool_page" : "site",
        tool_slug: toolSlug,
      });
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Section spacing="sm" aria-labelledby="tool-newsletter-heading">
      <ToolContainer maxWidth="md">
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 text-center shadow-sm sm:p-8">
          <h2
            id="tool-newsletter-heading"
            className="text-xl font-semibold tracking-tight text-neutral-900"
          >
            {title}
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-neutral-600">
            {description}
          </p>

          {success ? (
            <p className="mx-auto mt-6 max-w-md text-sm font-medium text-emerald-700">
              You&apos;re subscribed — watch your inbox for new tools and tips.
            </p>
          ) : (
            <form
              className="mx-auto mt-6 flex max-w-md flex-col items-center gap-3"
              onSubmit={handleSubmit}
              aria-label="Newsletter signup"
            >
              <Input
                type="email"
                name="email"
                placeholder="you@example.com"
                aria-label="Email address"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={error}
                required
                className="text-center sm:text-left"
              />
              <Button type="submit" size="md" disabled={loading}>
                {loading ? "Subscribing…" : "Subscribe"}
              </Button>
            </form>
          )}
        </div>
      </ToolContainer>
    </Section>
  );
}
