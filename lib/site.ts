import { getSiteUrl } from "@/lib/env";

export const siteConfig = {
  name: "Reset Goals",
  /** Set `showAppDownload` to true when the mobile app ships on Google Play. */
  features: {
    showAppDownload: false,
  },
  tagline: "Free productivity, focus, and planning tools",
  description:
    "Reset Goals offers free online productivity, focus, planning, and calculator tools designed to help you work smarter.",
  url: getSiteUrl(),
  locale: "en_US",
  author: "Reset Team",
  email: "hello@resetgoals.com",
  social: {
    twitter: "@resetgoals",
    github: "gunaedkhan-art/reset-website",
  },
  app: {
    name: "Reset App",
    description:
      "Take your productivity on the go with the Reset mobile app. Sync tools, save results, and stay focused anywhere.",
    iosUrl: "#",
    androidUrl: "#",
  },
  navigation: {
    main: [
      { label: "Home", href: "/" },
      { label: "Tools", href: "/tools" },
      { label: "Blog", href: "/blog" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "App", href: "/app" },
    ],
    footer: {
      legal: [
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
        { label: "Contact", href: "/contact" },
      ],
    },
  },
} as const;

export type NavItem = (typeof siteConfig.navigation.main)[number];
