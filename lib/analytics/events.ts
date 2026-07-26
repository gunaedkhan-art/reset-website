export type ToolAnalyticsEvent =
  | {
      name: "tool_calculate";
      tool_slug: string;
      mode: "calculator";
    }
  | {
      name: "tool_complete";
      tool_slug: string;
      mode: "decision-tree";
      result_id?: string;
    }
  | {
      name: "app_cta_click";
      tool_slug: string;
    }
  | {
      name: "newsletter_signup";
      source: string;
      tool_slug?: string;
    };

export type AnalyticsEvent = ToolAnalyticsEvent;

export function analyticsEventParams(
  event: AnalyticsEvent,
): Record<string, string | undefined> {
  const { name, ...params } = event;
  return { event: name, ...params };
}
