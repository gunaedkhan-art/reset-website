import type { FormEventHandler, ReactNode } from "react";
import type { ToolThemeColor } from "@/lib/tool-theme";
import type { FAQItem } from "./seo";

export interface RelatedTool {
  slug: string;
  title: string;
  description: string;
  category: string;
  href: string;
}

export interface ToolMetadata {
  slug: string;
  title: string;
  description: string;
  category: string;
  cluster?: string;
  keywords?: string[];
  featured?: boolean;
  canonicalPath?: string;
}

export interface ToolPageProps {
  metadata: ToolMetadata;
  relatedTools: RelatedTool[];
  categoryName?: string;
}

export interface ToolCalculateProps {
  label?: string;
  loading?: boolean;
  disabled?: boolean;
  form?: string;
  type?: "button" | "submit";
  onClick?: () => void;
}

export interface ToolAppCta {
  title: string;
  description: string;
}

export interface ToolTemplateProps {
  /** Page path for SEO, e.g. "/how-to-stop-procrastinating" */
  path?: string;
  /** Registry slug for analytics, e.g. "notification-cost-calculator" */
  toolSlug?: string;
  title: string;
  description: string;
  category?: string;
  breadcrumbs?: { label: string; href: string }[];
  /** Form fields and inputs */
  inputArea: ReactNode;
  /** Calculate button config — omit calculateArea to use these props */
  calculate?: ToolCalculateProps;
  /** Fully custom calculate button (overrides calculate props). Pass `false` to hide. */
  calculateArea?: ReactNode | false;
  /** Hide the calculate button (decision-tree tools) */
  showCalculate?: boolean;
  /** Results content — pass resultsEmpty=true to show placeholder */
  resultsArea?: ReactNode;
  resultsEmpty?: boolean;
  resultsEmptyMessage?: string;
  relatedTools?: RelatedTool[];
  faq?: FAQItem[];
  showNewsletter?: boolean;
  showAppCta?: boolean;
  /** Tool-specific copy for the app download block (required when showAppCta is true) */
  appCta: ToolAppCta;
  /** Thematic accent for the app download section */
  themeColor?: ToolThemeColor;
  newsletterTitle?: string;
  newsletterDescription?: string;
  /** @deprecated Use appCta.title */
  appDownloadTitle?: string;
  /** @deprecated Use appCta.description */
  appDownloadDescription?: string;
  /** Wraps input + calculate in a form */
  formId?: string;
  onSubmit?: FormEventHandler<HTMLFormElement>;
  className?: string;
}

export interface ToolCategory {
  slug: string;
  name: string;
  description: string;
}
