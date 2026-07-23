import type { MetadataRoute } from "next";
import { getAllPostSlugs } from "@/lib/blog";
import { siteConfig } from "@/lib/site";
import { getAllToolSlugs } from "@/lib/tools";
import { getToolCanonicalPath } from "@/lib/tools/tool-page";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url.replace(/\/$/, "");
  const now = new Date();

  /** Only indexable static pages — exclude placeholders (blog, app, contact). */
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/tools",
    "/about",
    "/privacy",
    "/terms",
  ].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.8,
  }));

  const toolRoutes: MetadataRoute.Sitemap = getAllToolSlugs().map((slug) => ({
    url: `${baseUrl}${getToolCanonicalPath(slug)}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const blogRoutes: MetadataRoute.Sitemap = getAllPostSlugs().map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...toolRoutes, ...blogRoutes];
}
