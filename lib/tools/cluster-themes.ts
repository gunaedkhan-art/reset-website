/** Visual themes keyed by SEO cluster hub (not every micro-cluster). */

export interface ClusterTheme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  muted: string;
  onPrimary: string;
  heroFrom: string;
  heroTo: string;
}

export const clusterThemes = {
  "deep-work": {
    id: "deep-work",
    name: "Deep Work",
    primary: "#1E3A8A",
    secondary: "#3B82F6",
    accent: "#6366F1",
    muted: "#EEF2FF",
    onPrimary: "#FFFFFF",
    heroFrom: "#EEF2FF",
    heroTo: "#C7D2FE",
  },
  "one-thing": {
    id: "one-thing",
    name: "ONE Thing",
    primary: "#0369A1",
    secondary: "#00A3D9",
    accent: "#00C3FF",
    muted: "#E0F2FE",
    onPrimary: "#023047",
    heroFrom: "#E0F2FE",
    heroTo: "#BAE6FD",
  },
  "phone-focus": {
    id: "phone-focus",
    name: "Phone & Focus",
    primary: "#BE123C",
    secondary: "#F43F5E",
    accent: "#FB7185",
    muted: "#FFF1F2",
    onPrimary: "#FFFFFF",
    heroFrom: "#FFF1F2",
    heroTo: "#FECDD3",
  },
  procrastination: {
    id: "procrastination",
    name: "Procrastination",
    primary: "#B45309",
    secondary: "#D97706",
    accent: "#F59E0B",
    muted: "#FFFBEB",
    onPrimary: "#FFFFFF",
    heroFrom: "#FFFBEB",
    heroTo: "#FDE68A",
  },
  money: {
    id: "money",
    name: "Money & Savings",
    primary: "#047857",
    secondary: "#059669",
    accent: "#10B981",
    muted: "#ECFDF5",
    onPrimary: "#FFFFFF",
    heroFrom: "#ECFDF5",
    heroTo: "#A7F3D0",
  },
  productivity: {
    id: "productivity",
    name: "Productivity",
    primary: "#5B21B6",
    secondary: "#7C3AED",
    accent: "#A78BFA",
    muted: "#F5F3FF",
    onPrimary: "#FFFFFF",
    heroFrom: "#F5F3FF",
    heroTo: "#DDD6FE",
  },
  default: {
    id: "default",
    name: "Tools",
    primary: "#023047",
    secondary: "#00A3D9",
    accent: "#00C3FF",
    muted: "#E5F9FF",
    onPrimary: "#FFFFFF",
    heroFrom: "#E5F9FF",
    heroTo: "#BAE6FD",
  },
} as const satisfies Record<string, ClusterTheme>;

export type ClusterThemeId = keyof typeof clusterThemes;

/** Maps config `taxonomy.cluster` values to a visual theme. */
export const clusterToThemeId: Record<string, ClusterThemeId> = {
  "deep-work": "deep-work",
  "focus-problems": "phone-focus",
  "phone-distraction": "phone-focus",
  "phone-checking": "phone-focus",
  doomscrolling: "phone-focus",
  "screen-time": "phone-focus",
  "social-media-time": "phone-focus",
  "phone-addiction": "phone-focus",
  procrastination: "procrastination",
  "stop-procrastinating": "procrastination",
  "one-thing": "one-thing",
  investment: "money",
  savings: "money",
  "weekly-planning": "one-thing",
  "getting-started": "productivity",
  overwhelm: "productivity",
  motivation: "productivity",
  habits: "productivity",
  "time-waste": "phone-focus",
  "meeting-cost": "productivity",
  "context-switch": "deep-work",
  homework: "productivity",
  "micro-time": "productivity",
};

export function getThemeForCluster(cluster: string): ClusterTheme {
  const themeId = clusterToThemeId[cluster] ?? "default";
  return clusterThemes[themeId];
}

/** Maps site category slugs to cluster visual themes for browse cards. */
export const categoryToThemeId: Record<string, ClusterThemeId> = {
  focus: "deep-work",
  productivity: "productivity",
  planning: "one-thing",
  calculators: "money",
};

export function getThemeForCategory(categorySlug: string): ClusterTheme {
  const themeId = categoryToThemeId[categorySlug] ?? "default";
  return clusterThemes[themeId];
}
