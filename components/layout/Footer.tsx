import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-neutral-200 bg-neutral-50">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4 lg:col-span-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-900 text-sm font-bold text-white">
                R
              </span>
              <span className="text-lg font-semibold text-neutral-900">
                {siteConfig.name}
              </span>
            </Link>
            <p className="max-w-md text-sm leading-relaxed text-neutral-600">
              {siteConfig.description}
            </p>
          </div>

          <div>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-neutral-900">
              Legal
            </h2>
            <ul className="space-y-2">
              {siteConfig.navigation.footer.legal.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-neutral-600 transition-colors hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 rounded"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-neutral-900">
              Newsletter
            </h2>
            <p className="mb-4 text-sm text-neutral-600">
              Get new tools and productivity tips in your inbox. No spam, ever.
            </p>
            <form
              className="space-y-3"
              action="#"
              aria-label="Newsletter signup placeholder"
            >
              <Input
                type="email"
                name="email"
                placeholder="you@example.com"
                aria-label="Email address"
                autoComplete="email"
              />
              <Button type="submit" size="sm" fullWidth>
                Subscribe
              </Button>
              <p className="text-xs text-neutral-500">
                Placeholder form — wire up your email provider when ready.
              </p>
            </form>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-neutral-200 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-neutral-500">
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          <p className="text-sm text-neutral-500">
            Built for speed, accessibility, and scale.
          </p>
        </div>
      </div>
    </footer>
  );
}
