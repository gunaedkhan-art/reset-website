import Link from "next/link";
import { JsonLd } from "@/components/seo/JsonLd";
import { Callout } from "@/components/ui/Callout";
import { InfoCard } from "@/components/ui/InfoCard";
import { Section } from "@/components/ui/Section";
import { siteConfig } from "@/lib/site";
import { toolTheme } from "@/lib/tool-theme";
import {
  breadcrumbSchema,
  faqSchema,
  webApplicationSchema,
} from "@/lib/seo";
import { getConfigBySlug } from "@/lib/tool-engine/compiler/manifest";
import { RichText } from "@/lib/content/rich-text";
import { resolveToolTheme } from "@/lib/tools/resolve-tool-theme";
import { cn } from "@/lib/utils";
import type { ToolTemplateProps } from "@/types/tool";
import { ToolAppDownload } from "./ToolAppDownload";
import { ToolCalculateButton } from "./ToolCalculateButton";
import { ToolClusterHero } from "./ToolClusterHero";
import {
  ToolContainer,
  ToolFormSection,
  ToolRelatedSection,
  ToolResultsSection,
} from "./ToolContainer";
import { ToolIconForConfig, getToolIconName } from "./ToolIcon";
import { ToolNewsletterSignup } from "./ToolNewsletterSignup";
import { ToolPageProse } from "./ToolPageProse";

export function ToolTemplate({
  path,
  toolSlug,
  title,
  description,
  category,
  breadcrumbs = [],
  inputArea,
  calculate,
  showCalculate = true,
  calculateArea,
  resultsArea,
  resultsEmpty = true,
  resultsEmptyMessage,
  relatedTools = [],
  faq = [],
  showNewsletter = true,
  showAppCta = siteConfig.features.showAppDownload,
  appCta,
  legalDisclaimer,
  themeColor = toolTheme.primary,
  newsletterTitle,
  newsletterDescription,
  appDownloadTitle,
  appDownloadDescription,
  formId = "tool-form",
  onSubmit,
  className,
  config,
}: ToolTemplateProps) {
  const resolvedTheme = config ? resolveToolTheme(config) : null;
  const resolvedThemeColor = resolvedTheme?.accent ?? themeColor;
  const toolPath =
    path ??
    (breadcrumbs.length > 0
      ? (breadcrumbs[breadcrumbs.length - 1]?.href ?? "/tools")
      : "/tools");

  const breadcrumbItems = [
    { name: "Home", href: "/" },
    { name: "Tools", href: "/tools" },
    ...breadcrumbs.map((item) => ({ name: item.label, href: item.href })),
    { name: title, href: toolPath },
  ];

  const appCtaTitle = appCta.title ?? appDownloadTitle ?? "";
  const appCtaDescription =
    appCta.description ?? appDownloadDescription ?? "";

  const schemas = [
    webApplicationSchema({ name: title, description, path: toolPath }),
    breadcrumbSchema(breadcrumbItems.slice(0, -1)),
    faqSchema(faq),
  ].filter((schema): schema is NonNullable<typeof schema> => schema !== null);

  const calculateButton =
    calculateArea === false || !showCalculate
      ? null
      : calculateArea ?? (
    <ToolCalculateButton
      label={calculate?.label}
      loading={calculate?.loading}
      disabled={calculate?.disabled}
      form={calculate?.form ?? formId}
      type={calculate?.type ?? "submit"}
      onClick={calculate?.onClick}
    />
  );

  const handleSubmit = onSubmit ?? ((event) => event.preventDefault());

  const formContent = (
    <div className="space-y-6">
      <ToolFormSection>{inputArea}</ToolFormSection>
      {calculateButton && (
        <div className="flex justify-center sm:justify-start">{calculateButton}</div>
      )}
    </div>
  );

  return (
    <article className={cn("", className)}>
      <JsonLd schema={schemas} />

      {/* Title → Description → Input → Calculate → Results */}
      <Section spacing="md">
        <ToolContainer maxWidth="md">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-neutral-500">
              {breadcrumbItems.slice(0, -1).map((item, index) => (
                <li key={`${item.href}-${index}`} className="flex items-center gap-2">
                  {index > 0 && <span aria-hidden="true">/</span>}
                  <Link
                    href={item.href}
                    className="rounded hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
              <li className="flex items-center gap-2">
                <span aria-hidden="true">/</span>
                <span className="text-neutral-900" aria-current="page">
                  {title}
                </span>
              </li>
            </ol>
          </nav>

          {category && (
            <p
              className="mb-3 text-sm font-medium uppercase tracking-wider"
              style={{ color: resolvedTheme?.primary ?? undefined }}
            >
              {category}
            </p>
          )}

          {config && resolvedTheme && (
            <ToolClusterHero
              theme={resolvedTheme}
              icon={getToolIconName(config)}
              title={config.content.h1}
            />
          )}

          <header className="mb-8 space-y-4">
            <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 sm:text-4xl">
              {title}
            </h1>
            <p className="text-lg leading-relaxed text-neutral-600">{description}</p>
          </header>

          {config && <ToolPageProse config={config} />}

          <form id={formId} onSubmit={handleSubmit} noValidate>
            {formContent}
          </form>

          <div className="mt-8">
            <ToolResultsSection
              empty={resultsEmpty && !resultsArea}
              emptyMessage={resultsEmptyMessage}
            >
              {resultsArea}
            </ToolResultsSection>
          </div>
        </ToolContainer>
      </Section>

      {legalDisclaimer && (
        <Section spacing="sm">
          <ToolContainer maxWidth="md">
            <Callout variant="warning" title="Disclaimer">
              {legalDisclaimer}
            </Callout>
          </ToolContainer>
        </Section>
      )}

      {/* Download app — immediately after tool */}
      {showAppCta && (
        <ToolAppDownload
          title={appCtaTitle}
          description={appCtaDescription}
          themeColor={resolvedThemeColor}
          toolSlug={toolSlug}
        />
      )}

      {/* Newsletter signup */}
      {showNewsletter && (
        <ToolNewsletterSignup
          title={newsletterTitle}
          description={newsletterDescription}
          toolSlug={toolSlug}
        />
      )}

      {/* Related tools */}
      <Section spacing="sm" className="border-t border-neutral-100 bg-neutral-50/50">
        <ToolContainer maxWidth="md">
          <ToolRelatedSection>
            {relatedTools.length > 0 ? (
              <ul className="grid gap-4 sm:grid-cols-2">
                {relatedTools.map((tool) => {
                  const relatedConfig = getConfigBySlug(tool.slug);
                  const relatedTheme = relatedConfig
                    ? resolveToolTheme(relatedConfig)
                    : null;
                  return (
                  <li key={tool.slug}>
                    <InfoCard
                      title={tool.title}
                      description={tool.description}
                      href={tool.href}
                      icon={
                        relatedConfig ? (
                          <div
                            className="flex h-10 w-10 items-center justify-center rounded-xl"
                            style={{
                              backgroundColor: relatedTheme?.muted ?? "#f5f5f5",
                              color: relatedTheme?.primary ?? "#404040",
                            }}
                          >
                            <ToolIconForConfig config={relatedConfig} size={20} />
                          </div>
                        ) : undefined
                      }
                    />
                  </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-sm text-neutral-500">
                More tools in this category coming soon.
              </p>
            )}
          </ToolRelatedSection>
        </ToolContainer>
      </Section>

      {/* FAQ */}
      {faq.length > 0 && (
        <Section spacing="sm">
          <ToolContainer maxWidth="md">
            <h2 className="mb-6 text-xl font-semibold tracking-tight text-neutral-900">
              Frequently asked questions
            </h2>
            <dl className="space-y-4">
              {faq.map((item) => (
                <div
                  key={item.question}
                  className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm"
                >
                  <dt className="text-base font-semibold text-neutral-900">
                    {item.question}
                  </dt>
                  <dd className="mt-2 text-sm leading-relaxed text-neutral-600">
                    <RichText text={item.answer} />
                  </dd>
                </div>
              ))}
            </dl>
          </ToolContainer>
        </Section>
      )}
    </article>
  );
}
