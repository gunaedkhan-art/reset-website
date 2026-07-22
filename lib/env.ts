/**
 * Resolves the public site URL for metadata, sitemap, and canonical URLs.
 *
 * Priority:
 * 1. NEXT_PUBLIC_SITE_URL — set in Vercel (Production + Preview) for your domain
 * 2. VERCEL_URL — auto-injected by Vercel (e.g. my-app.vercel.app)
 * 3. Fallback for local development
 */
export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  }

  return "https://reset.tools";
}
