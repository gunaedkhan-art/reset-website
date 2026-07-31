import { ENGINE_CONSTANTS } from "./constants";

export const notificationCostCalculatorConfig = {
  schemaVersion: "1.0" as const,
  id: "notification-cost-calculator",
  slug: "notification-cost-calculator",
  status: "published" as const,

  seo: {
    title: "Notification Cost Calculator",
    metaDescription:
      "Calculate the real cost of phone notifications — interruptions per year, hours lost to refocusing, and what that means for productivity and earnings.",
    primaryKeyword: "notification cost calculator",
    secondaryKeywords: [
      "distraction calculator",
      "phone notifications",
      "interruption cost",
      "productivity calculator",
    ],
    searchIntent: "calculator" as const,
    canonicalPath: "/notification-cost-calculator",
  },

  taxonomy: {
    category: "focus" as const,
    tags: ["notifications", "focus", "productivity"],
    cluster: "phone-distraction",
    clusterRole: "supporting" as const,
  },

  content: {
    h1: "Notification Cost Calculator",
    intro:
      "Your phone pings dozens of times a day — but what's the real cost in lost focus hours? Enter your daily notification count and see the annual impact.",
    icon: "phone",
    proseTitle: "About this calculator",
    sections: [
      {
        id: "problem",
        heading: "Death by a thousand pings",
        framework: "pas",
        body: "Each notification breaks concentration — even the ones you ignore. Over a day, those fragments add up to hours spent recovering instead of doing meaningful work.",
      },
      {
        id: "agitation",
        heading: "What interruptions actually cost",
        framework: "pas",
        body: "[UC Irvine interruption research](https://www.ics.uci.edu/~gmark/chi08.pdf) found it can take more than 23 minutes to return to deep work after some interruptions. This calculator uses a conservative 5-minute average per ping — distraction plus refocus time.",
      },
      {
        id: "outcome",
        heading: "What you'll learn",
        framework: "aida",
        body: "You'll see estimated interruptions per year, hours lost to recovery, work-days equivalent, and an illustrative earnings impact you can scale to your own rate.",
      },
    ],
  },

  mode: "calculator" as const,
  flow: {
    type: "calculator" as const,
    inputs: [
      {
        id: "notifications",
        type: "integer" as const,
        label: "Notifications per day",
        placeholder: "e.g. 65",
        hint: "Daily average — weekdays and weekends combined.",
        min: 0,
        max: 500,
        required: true,
        integer: true,
      },
    ],
    constants: {
      DAYS_PER_YEAR: ENGINE_CONSTANTS.DAYS_PER_YEAR,
      MINUTES_PER_INTERRUPTION: ENGINE_CONSTANTS.MINUTES_LOST_PER_NOTIFICATION,
      WORK_HOURS_PER_DAY: ENGINE_CONSTANTS.WORK_HOURS_PER_DAY,
      HOURLY_WAGE: ENGINE_CONSTANTS.ILLUSTRATIVE_HOURLY_WAGE,
    },
    expressions: {
      interruptionsPerYear: "inputs.notifications * constants.DAYS_PER_YEAR",
      minutesLostPerDay:
        "inputs.notifications * constants.MINUTES_PER_INTERRUPTION",
      hoursLostPerYear:
        "(inputs.notifications * constants.DAYS_PER_YEAR * constants.MINUTES_PER_INTERRUPTION) / 60",
      workDaysLostPerYear:
        "calcs.hoursLostPerYear / constants.WORK_HOURS_PER_DAY",
      illustrativeEarningsLost: "calcs.hoursLostPerYear * constants.HOURLY_WAGE",
      deepWorkBlocks: "calcs.hoursLostPerYear / 2",
      pomodoros: "calcs.hoursLostPerYear",
    },
    resultTemplateId: "default",
  },

  results: {
    emptyMessage:
      "Enter your daily notification count to see the true cost of interruptions.",
    templates: [
      {
        id: "default",
        cards: [
          {
            title: "Estimated interruptions",
            valueTemplate: "{{calcs.interruptionsPerYear}}",
            descriptionTemplate:
              "{{inputs.notifications}}/day × 365 — each notification treated as one interruption",
          },
          {
            title: "True cost (time lost)",
            valueTemplate: "{{calcs.hoursLostPerYear}} hrs/yr",
            descriptionTemplate:
              "5 min each: distraction + refocus ({{calcs.minutesLostPerDay}} min/day)",
          },
        ],
        summaryTemplates: [
          "That's {{calcs.workDaysLostPerYear}} work days per year lost to recovery — roughly {{calcs.illustrativeEarningsLost}} at an illustrative $35/hr.",
        ],
        comparisonTitle: "What those pings actually cost",
        comparisonRules: [
          {
            when: "inputs.notifications >= 20",
            textTemplate:
              "At {{inputs.notifications}} pings/day, your brain rarely settles — chronic interruption is linked to higher stress and lower wellbeing.",
          },
          {
            when: "inputs.notifications >= 10",
            textTemplate:
              "Research links frequent phone interruptions to increased cortisol and reduced sense of control — {{inputs.notifications}} daily pings keep you in reactive mode.",
          },
          {
            when: "calcs.workDaysLostPerYear >= 1",
            textTemplate:
              "You lose roughly {{calcs.workDaysLostPerYear}} full work days per year just recovering from notifications — before counting the work you never started.",
          },
          {
            when: "calcs.hoursLostPerYear >= 40",
            textTemplate:
              "{{calcs.hoursLostPerYear}} hours/year of refocus time — a full week of productivity erased by fragments.",
          },
          {
            when: "true",
            textTemplate:
              "At an illustrative $35/hr wage, that's about {{calcs.illustrativeEarningsLost}}/year in lost focus time — scale up or down with your own rate.",
          },
          {
            when: "calcs.deepWorkBlocks >= 10",
            textTemplate:
              "Enough time for {{calcs.deepWorkBlocks}} two-hour deep work sessions — the kind of blocks where real progress happens.",
          },
          {
            when: "calcs.interruptionsPerYear >= 1000",
            textTemplate:
              "{{calcs.interruptionsPerYear}} interruptions per year trains your brain to expect the next ping — attention becomes a scarce resource.",
          },
          {
            when: "calcs.pomodoros >= 20",
            textTemplate:
              "That's {{calcs.pomodoros}}+ lost Pomodoro sessions (25 min each) — structured focus you never get to finish.",
          },
        ],
        fallbackComparison:
          "Even a few daily interruptions fragment attention — batching notifications is one of the highest-ROI focus habits.",
      },
    ],
  },

  guidance: [
    {
      title: "How to count your notifications",
      body: "Include messaging, email, social, news, shopping, and system alerts. Group chats alone can account for dozens per day.",
      list: [
        "iPhone: Settings → Notifications → scroll apps, or Screen Time → Pickups",
        "Android: Settings → Notifications → Notification history",
        "Quick estimate: count pings for one waking hour × active phone hours",
      ],
    },
    {
      title: "What counts as one notification?",
      body: "Each lock-screen banner, badge update, buzz, or ding counts — even if you ignore it.",
    },
  ],

  ctas: {
    app: {
      title: "Silence the noise — keep what matters",
      description:
        "Reset batches notifications, blocks distracting apps during focus, and helps you work without your phone constantly pulling you out of flow.",
    },
  },

  faq: [
    {
      question: "How is “true cost” calculated?",
      answer:
        "Each notification costs about 30 seconds to notice and dismiss, plus an estimated 4.5 minutes to refocus — 5 minutes total per interruption.",
    },
    {
      question: "Is 5 minutes per notification realistic?",
      answer:
        "UC Irvine research found ~23 minutes to fully resume deep work after some interruptions. We use 5 minutes as a conservative daily-life average.",
    },
    {
      question: "Where does the earnings figure come from?",
      answer:
        "It's illustrative only: lost hours × $35/hr (rough US median). Multiply lost hours by your own rate for a personal estimate.",
    },
  ],

  recommendations: [],
};
