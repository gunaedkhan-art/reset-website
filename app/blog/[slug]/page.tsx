import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/seo/JsonLd";
import { Section } from "@/components/ui/Section";
import { getAllPostSlugs, getPostBySlug } from "@/lib/blog";
import { createMetadata } from "@/lib/seo";
import { breadcrumbSchema, webPageSchema } from "@/lib/seo/json-ld";
import { formatDate } from "@/lib/utils";
import type { JsonLdSchema } from "@/types/seo";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return createMetadata({
      title: "Article not found",
      description: "The requested article could not be found.",
      path: `/blog/${slug}`,
      noIndex: true,
    });
  }

  return createMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
    ogType: "article",
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
    keywords: post.tags,
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <JsonLd
        schema={
          [
            webPageSchema({
              title: post.title,
              description: post.description,
              path: `/blog/${post.slug}`,
            }),
            breadcrumbSchema([
              { name: "Home", href: "/" },
              { name: "Blog", href: "/blog" },
              { name: post.title, href: `/blog/${post.slug}` },
            ]),
          ].filter((schema): schema is JsonLdSchema => schema !== null)
        }
      />

      <Section spacing="md" className="border-b border-neutral-100">
        <header className="mx-auto max-w-3xl">
          <p className="text-sm text-neutral-500">
            {formatDate(post.publishedAt)} · {post.readingTimeMinutes} min read
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
            {post.title}
          </h1>
          <p className="mt-4 text-lg text-neutral-600">{post.description}</p>
        </header>
      </Section>

      <Section spacing="md">
        <article className="prose mx-auto max-w-3xl">
          {/* Future: render markdown content here */}
          <p>{post.content}</p>
        </article>
      </Section>
    </>
  );
}
