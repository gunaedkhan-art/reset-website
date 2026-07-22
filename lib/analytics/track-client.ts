"use client";

import type { AnalyticsEvent } from "./events";
import { analyticsEventParams } from "./events";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(event: AnalyticsEvent): void {
  if (typeof window === "undefined") return;

  const params = analyticsEventParams(event);

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(params);

  if (typeof window.gtag === "function") {
    window.gtag("event", event.name, params);
  }

  if (process.env.NODE_ENV === "development") {
    console.debug("[analytics]", event);
  }
}
