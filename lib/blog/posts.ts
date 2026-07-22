import type { BlogCategory, BlogPost, BlogPostMeta } from "@/types/blog";

/**
 * Blog content directory. Future markdown files will live in content/blog/.
 * This registry is the single source of truth until MDX/markdown pipeline is wired.
 */
export const blogCategories: BlogCategory[] = [
  {
    slug: "productivity",
    name: "Productivity",
    description: "Tips and strategies for getting more done with less friction.",
  },
  {
    slug: "focus",
    name: "Focus",
    description: "Deep work, attention management, and distraction-free workflows.",
  },
  {
    slug: "planning",
    name: "Planning",
    description: "Goal setting, scheduling, and long-term planning frameworks.",
  },
];

/** Registered blog posts — add entries here or via markdown loader in the future. */
const blogPosts: BlogPost[] = [];

export function getAllPosts(includeDrafts = false): BlogPostMeta[] {
  return blogPosts
    .filter((post) => includeDrafts || !post.draft)
    .map(({ content, ...meta }) => {
      void content;
      return meta;
    })
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug && !post.draft);
}

export function getPostsByTag(tag: string): BlogPostMeta[] {
  return getAllPosts().filter((post) =>
    post.tags.some((t) => t.toLowerCase() === tag.toLowerCase()),
  );
}

export function getPostsByCategory(categorySlug: string): BlogPostMeta[] {
  return getAllPosts().filter((post) =>
    post.tags.some((t) => t.toLowerCase() === categorySlug.toLowerCase()),
  );
}

export function getAllPostSlugs(): string[] {
  return getAllPosts().map((post) => post.slug);
}

export function getFeaturedPosts(limit = 3): BlogPostMeta[] {
  return getAllPosts()
    .filter((post) => post.featured)
    .slice(0, limit);
}
