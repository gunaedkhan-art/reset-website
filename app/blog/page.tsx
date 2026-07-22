import type { Metadata } from "next";
import Link from "next/link";
import { Callout } from "@/components/ui/Callout";
import { PageHeading } from "@/components/ui/PageHeading";
import { Section } from "@/components/ui/Section";
import { blogCategories, getAllPosts } from "@/lib/blog";
import { createMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = createMetadata({
  title: "Blog",
  description:
    "Productivity tips, focus strategies, and planning guides from the Reset team.",
  path: "/blog",
  keywords: ["productivity blog", "focus tips", "planning guides"],
});

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <>
      <Section spacing="md" className="border-b border-neutral-100 bg-neutral-50/50">
        <PageHeading
          eyebrow="Insights"
          title="Blog"
          description="Practical articles on productivity, deep work, and intentional planning. Markdown-ready architecture — articles ship when you're ready."
        />
      </Section>

      <Section spacing="md">
        <div className="mb-10">
          <h2 className="text-xl font-semibold text-neutral-900">Topics</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {blogCategories.map((category) => (
              <li key={category.slug}>
                <span className="inline-flex rounded-full border border-neutral-200 bg-white px-3 py-1 text-sm text-neutral-700">
                  {category.name}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {posts.length === 0 ? (
          <Callout title="No articles yet">
            The blog structure is in place at{" "}
            <code className="rounded bg-neutral-200/60 px-1.5 py-0.5 text-xs">
              lib/blog/
            </code>{" "}
            and{" "}
            <code className="rounded bg-neutral-200/60 px-1.5 py-0.5 text-xs">
              content/blog/
            </code>
            . Add markdown posts to publish your first article.
          </Callout>
        ) : (
          <ul className="space-y-6">
            {posts.map((post) => (
              <li key={post.slug}>
                <article className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
                  <h2 className="text-xl font-semibold text-neutral-900">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="rounded hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
                    >
                      {post.title}
                    </Link>
                  </h2>
                  <p className="mt-2 text-sm text-neutral-500">
                    {formatDate(post.publishedAt)} · {post.readingTimeMinutes} min
                    read
                  </p>
                  <p className="mt-3 text-neutral-600">{post.description}</p>
                </article>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </>
  );
}
