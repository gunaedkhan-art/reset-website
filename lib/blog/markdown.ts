/**
 * Markdown blog loader — ready for future content/blog/*.md files.
 *
 * To enable:
 * 1. npm install gray-matter
 * 2. Add markdown files to content/blog/
 * 3. Implement loadPostsFromMarkdown() using fs/promises in a server-only module
 */

import type { BlogPost } from "@/types/blog";
import { siteConfig } from "@/lib/site";

export const BLOG_CONTENT_DIR = "content/blog";

export interface MarkdownFrontmatter {
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  author?: string;
  tags?: string[];
  featured?: boolean;
  draft?: boolean;
}

export function estimateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function parseMarkdownPost(
  slug: string,
  rawContent: string,
  frontmatter: MarkdownFrontmatter,
): BlogPost {
  return {
    slug,
    title: frontmatter.title,
    description: frontmatter.description,
    publishedAt: frontmatter.publishedAt,
    updatedAt: frontmatter.updatedAt,
    author: frontmatter.author ?? siteConfig.author,
    tags: frontmatter.tags ?? [],
    featured: frontmatter.featured ?? false,
    draft: frontmatter.draft ?? false,
    readingTimeMinutes: estimateReadingTime(rawContent),
    content: rawContent,
  };
}
