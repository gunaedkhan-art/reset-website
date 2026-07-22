import type {
  BreadcrumbItem,
  FAQItem,
  JsonLdSchema,
  OrganizationSchema,
} from "@/types/seo";
import { absoluteUrl } from "@/lib/utils";
import { siteConfig } from "@/lib/site";

export function createJsonLd<T extends JsonLdSchema>(schema: T): T {
  return schema;
}

export function organizationSchema(
  overrides: Partial<OrganizationSchema> = {},
): JsonLdSchema {
  const org: OrganizationSchema = {
    name: siteConfig.name,
    url: siteConfig.url,
    logo: absoluteUrl("/logo.png"),
    description: siteConfig.description,
    email: siteConfig.email,
    sameAs: [],
    ...overrides,
  };

  return createJsonLd({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: org.name,
    url: org.url,
    ...(org.logo && { logo: org.logo }),
    ...(org.description && { description: org.description }),
    ...(org.email && { email: org.email }),
    ...(org.sameAs &&
      org.sameAs.length > 0 && { sameAs: org.sameAs }),
  });
}

export function faqSchema(items: FAQItem[]): JsonLdSchema | null {
  if (items.length === 0) return null;

  return createJsonLd({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  });
}

export function breadcrumbSchema(
  items: BreadcrumbItem[],
): JsonLdSchema | null {
  if (items.length === 0) return null;

  return createJsonLd({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.href),
    })),
  });
}

export function webPageSchema(options: {
  title: string;
  description: string;
  path: string;
}): JsonLdSchema {
  return createJsonLd({
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: options.title,
    description: options.description,
    url: absoluteUrl(options.path),
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
    },
  });
}

export function webApplicationSchema(options: {
  name: string;
  description: string;
  path: string;
}): JsonLdSchema {
  return createJsonLd({
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: options.name,
    description: options.description,
    url: absoluteUrl(options.path),
    applicationCategory: "ProductivityApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  });
}
