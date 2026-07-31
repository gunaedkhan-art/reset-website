import type { SVGProps } from "react";
import type { ToolConfig } from "@/lib/tool-engine/schema/tool-config";
import { cn } from "@/lib/utils";

export const toolIconNames = [
  "target",
  "brain",
  "phone",
  "clock",
  "chart",
  "path",
  "coin",
  "calculator",
  "quiz",
  "checklist",
  "focus",
  "calendar",
  "shield",
  "blocks",
] as const;

export type ToolIconName = (typeof toolIconNames)[number];

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Svg({
  size = 20,
  className,
  children,
  ...props
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("shrink-0", className)}
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

const icons: Record<ToolIconName, (props: IconProps) => React.ReactElement> = {
  target: (props) => (
    <Svg {...props}>
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
    </Svg>
  ),
  brain: (props) => (
    <Svg {...props}>
      <path d="M8 5a3 3 0 0 0-3 3v1a2 2 0 0 0 0 4v1a3 3 0 0 0 3 3" />
      <path d="M16 5a3 3 0 0 1 3 3v1a2 2 0 0 1 0 4v1a3 3 0 0 1-3 3" />
      <path d="M8 5c1.5-1 3.5-1 4 0s2.5 1 4 0M8 19c1.5 1 3.5 1 4 0s2.5-1 4 0" />
    </Svg>
  ),
  phone: (props) => (
    <Svg {...props}>
      <rect x="7" y="2" width="10" height="20" rx="2" />
      <path d="M11 18h2" />
    </Svg>
  ),
  clock: (props) => (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </Svg>
  ),
  chart: (props) => (
    <Svg {...props}>
      <path d="M4 19V5" />
      <path d="M4 19h16" />
      <path d="M8 15V9M12 15V6M16 15v-4" />
    </Svg>
  ),
  path: (props) => (
    <Svg {...props}>
      <path d="M4 17c3-6 6-10 16-12" />
      <circle cx="4" cy="17" r="2" fill="currentColor" stroke="none" />
      <circle cx="20" cy="5" r="2" fill="currentColor" stroke="none" />
    </Svg>
  ),
  coin: (props) => (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v10M9 9.5h4.5a2 2 0 1 1 0 4H9" />
    </Svg>
  ),
  calculator: (props) => (
    <Svg {...props}>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M8 7h8M8 11h2M12 11h2M16 11h0M8 15h2M12 15h2M16 15h0" />
    </Svg>
  ),
  quiz: (props) => (
    <Svg {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9a2.5 2.5 0 1 1 3.8 2.1c-.8.6-1.3 1.1-1.3 2.4" />
      <circle cx="12" cy="17" r="0.75" fill="currentColor" stroke="none" />
    </Svg>
  ),
  checklist: (props) => (
    <Svg {...props}>
      <path d="M9 6h10M9 12h10M9 18h10" />
      <path d="M5 6l1 1 2-2M5 12l1 1 2-2M5 18l1 1 2-2" />
    </Svg>
  ),
  focus: (props) => (
    <Svg {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </Svg>
  ),
  calendar: (props) => (
    <Svg {...props}>
      <rect x="4" y="5" width="16" height="16" rx="2" />
      <path d="M8 3v4M16 3v4M4 10h16" />
    </Svg>
  ),
  shield: (props) => (
    <Svg {...props}>
      <path d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3z" />
    </Svg>
  ),
  blocks: (props) => (
    <Svg {...props}>
      <rect x="4" y="4" width="7" height="7" rx="1" />
      <rect x="13" y="4" width="7" height="7" rx="1" />
      <rect x="4" y="13" width="7" height="7" rx="1" />
      <rect x="13" y="13" width="7" height="7" rx="1" />
    </Svg>
  ),
};

const clusterIconDefaults = {
  "deep-work": "brain",
  "one-thing": "target",
  "phone-distraction": "phone",
  "phone-checking": "phone",
  doomscrolling: "phone",
  "screen-time": "phone",
  "social-media-time": "phone",
  "phone-addiction": "phone",
  "focus-problems": "focus",
  procrastination: "clock",
  "stop-procrastinating": "clock",
  investment: "coin",
  savings: "path",
  "weekly-planning": "calendar",
  "getting-started": "blocks",
  overwhelm: "checklist",
  motivation: "focus",
  habits: "checklist",
  "time-waste": "clock",
  "meeting-cost": "calendar",
  "context-switch": "blocks",
  homework: "checklist",
  "micro-time": "clock",
} as const;

type ClusterIconKey = keyof typeof clusterIconDefaults;

function getClusterIcon(cluster: string): ToolIconName | undefined {
  if (cluster in clusterIconDefaults) {
    return clusterIconDefaults[cluster as ClusterIconKey];
  }
  return undefined;
}

function isToolIconName(value: string): value is ToolIconName {
  return (toolIconNames as readonly string[]).includes(value);
}

export function getToolIconName(config: Pick<ToolConfig, "content" | "taxonomy" | "mode" | "slug">): ToolIconName {
  const fromContent = config.content.icon;
  if (fromContent && isToolIconName(fromContent)) {
    return fromContent;
  }

  const fromCluster = getClusterIcon(config.taxonomy.cluster);
  if (fromCluster) {
    return fromCluster;
  }

  if (config.slug.includes("savings-path")) {
    return "path";
  }

  switch (config.mode) {
    case "calculator":
      return "calculator";
    case "decision-tree":
      return "quiz";
    default:
      return "blocks";
  }
}

export type ToolIconProps = Omit<IconProps, "name"> & {
  name: ToolIconName;
};

export function ToolIcon({ name, ...props }: ToolIconProps) {
  const Icon = icons[name];
  return Icon(props);
}

export function ToolIconForConfig({
  config,
  ...props
}: Omit<IconProps, "name"> & { config: Pick<ToolConfig, "content" | "taxonomy" | "mode" | "slug"> }) {
  const iconName: ToolIconName = getToolIconName(config);
  return <ToolIcon name={iconName} {...props} />;
}
