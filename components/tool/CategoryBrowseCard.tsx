import Link from "next/link";
import { ToolIcon, type ToolIconName } from "@/components/tool/ToolIcon";
import { getThemeForCategory } from "@/lib/tools/cluster-themes";

const categoryIcons: Record<string, ToolIconName> = {
  focus: "focus",
  productivity: "blocks",
  planning: "calendar",
  calculators: "calculator",
};

export interface CategoryBrowseCardProps {
  slug: string;
  name: string;
  description: string;
  href: string;
}

/** Category browse card with cluster-mapped theme gradient and icon. */
export function CategoryBrowseCard({
  slug,
  name,
  description,
  href,
}: CategoryBrowseCardProps) {
  const theme = getThemeForCategory(slug);
  const icon = categoryIcons[slug] ?? "blocks";

  return (
    <Link
      href={href}
      className="group flex h-full flex-col rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition-colors hover:border-neutral-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
      style={{
        background: `linear-gradient(160deg, ${theme.heroFrom} 0%, white 60%)`,
      }}
    >
      <div
        className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl"
        style={{
          backgroundColor: theme.primary,
          color: theme.onPrimary,
        }}
      >
        <ToolIcon name={icon} size={20} />
      </div>
      <span className="font-semibold text-neutral-900 group-hover:text-neutral-950">
        {name}
      </span>
      <span className="mt-1 text-sm leading-relaxed text-neutral-600">{description}</span>
    </Link>
  );
}
