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
      name: "savings_path_checkin";
      tool_slug: string;
    }
  | {
      name: "one_thing_weekly_checkin";
      tool_slug: string;
      status: "yes" | "partial" | "skipped";
    }
  | {
      name: "one_thing_weekly_prefill";
      tool_slug: string;
    }
  | {
      name: "one_thing_time_block_click";
      tool_slug: string;
      source?: string;
    }
  | {
      name: "cluster_journey_step_click";
      hub_slug: string;
      tool_slug: string;
      step_number: string;
      optional: "true" | "false";
    }
  | {
      name: "cluster_hub_pillar_click";
      hub_slug: string;
      tool_slug: string;
    }
  | {
      name: "tracker_continue_click";
      tracker_kind: "savings-path" | "one-thing-weekly";
    }
  | {
      name: "one_thing_weekly_copy_summary";
      tool_slug: string;
      includes_trends: "true" | "false";
    }
  | {
      name: "one_thing_weekly_share_summary";
      tool_slug: string;
      method: "native" | "email";
      includes_trends: "true" | "false";
    }
  | {
      name: "savings_path_copy_summary";
      tool_slug: string;
    }
  | {
      name: "savings_path_share_summary";
      tool_slug: string;
      method: "native" | "email";
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
