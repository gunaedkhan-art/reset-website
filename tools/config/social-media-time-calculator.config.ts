import { ENGINE_CONSTANTS } from "./constants";

export const socialMediaTimeCalculatorConfig = {
  schemaVersion: "1.0" as const,
  id: "social-media-time-calculator",
  slug: "social-media-time-calculator",
  status: "published" as const,

  seo: {
    title: "Social Media Time Calculator",
    metaDescription:
      "Calculate how much time you spend on social media per year — hours, days, and work weeks lost to scrolling across all platforms.",
    primaryKeyword: "social media time calculator",
    secondaryKeywords: [
      "time spent on social media",
      "social media hours per year",
      "scrolling time calculator",
      "tiktok instagram time",
      "social media usage calculator",
    ],
    searchIntent: "calculator" as const,
    canonicalPath: "/social-media-time-calculator",
  },

  taxonomy: {
    category: "focus" as const,
    tags: ["social-media", "screen-time", "digital-wellbeing"],
    cluster: "social-media-time",
    clusterRole: "supporting" as const,
  },

  content: {
    h1: "Social Media Time Calculator",
    intro:
      "Add up all your feeds — see how many days and work weeks you spend scrolling each year.",
    icon: "chart",
    proseTitle: "About this calculator",
    sections: [
      {
        id: "problem",
        heading: "Death by a thousand feeds",
        framework: "pas",
        body: "Instagram, TikTok, X, Reddit — each alone seems manageable. Combined, they eat evenings, mornings, and gaps between tasks until the year disappears into scroll time.",
      },
      {
        id: "concept",
        heading: "Total social cost",
        framework: "concept",
        body: "[Cal Newport](https://calnewport.com/) distinguishes intentional technology use from default consumption — knowing your total social media hours is the first step toward choosing which platforms earn that time.",
      },
      {
        id: "outcome",
        heading: "What you'll learn",
        framework: "outcome",
        body: "Total daily and annual social media hours, days per year on feeds, and work-week equivalents across all platforms combined.",
      },
    ],
  },

  mode: "calculator" as const,
  flow: {
    type: "calculator" as const,
    inputs: [
      {
        id: "minutes_per_day",
        type: "integer" as const,
        label: "Total social media minutes per day",
        placeholder: "e.g. 90",
        hint: "Combine all platforms — check Screen Time or Digital Wellbeing.",
        min: 0,
        max: 1440,
        required: true,
        integer: true,
      },
    ],
    constants: {
      DAYS_PER_YEAR: ENGINE_CONSTANTS.DAYS_PER_YEAR,
      HOURS_PER_DAY: 24,
      HOURS_PER_WORK_WEEK: ENGINE_CONSTANTS.WORK_HOURS_PER_WEEK,
    },
    expressions: {
      hoursPerYear: "(inputs.minutes_per_day * constants.DAYS_PER_YEAR) / 60",
      daysPerYear: "calcs.hoursPerYear / constants.HOURS_PER_DAY",
      workingWeeksLost: "calcs.hoursPerYear / constants.HOURS_PER_WORK_WEEK",
      booksCount: "floor(calcs.hoursPerYear / 5)",
      fullWeeks: "floor(calcs.daysPerYear / 7)",
      halfHourBlocks: "floor((inputs.minutes_per_day * constants.DAYS_PER_YEAR) / 30)",
    },
    resultTemplateId: "default",
  },

  results: {
    emptyMessage:
      "Enter your combined daily social media minutes to see the annual total.",
    templates: [
      {
        id: "default",
        cardColumns: 3 as const,
        cards: [
          {
            title: "Hours per year",
            valueTemplate: "{{calcs.hoursPerYear|decimal1}}",
            descriptionTemplate: "{{inputs.minutes_per_day}} min/day × 365",
          },
          {
            title: "Full days per year",
            valueTemplate: "{{calcs.daysPerYear|decimal1}}",
            descriptionTemplate: "24-hour days of scrolling",
          },
          {
            title: "Work weeks lost",
            valueTemplate: "{{calcs.workingWeeksLost|decimal1}}",
            descriptionTemplate: "At a 40-hour work week",
          },
        ],
        comparisonTitle: "What you could do instead",
        comparisonRules: [
          {
            when: "calcs.booksCount >= 10",
            textTemplate:
              "Enough time to read {{calcs.booksCount}}+ books (at ~5 hours each) — knowledge instead of feeds.",
          },
          {
            when: "calcs.fullWeeks >= 4",
            textTemplate:
              "{{calcs.fullWeeks}} full weeks per year on social — a month of waking life on autopilot scroll.",
          },
          {
            when: "inputs.minutes_per_day >= 120",
            textTemplate:
              "Over 2 hours daily on social — cutting 30 minutes returns 180+ hours per year.",
          },
          {
            when: "calcs.halfHourBlocks >= 500",
            textTemplate:
              "{{calcs.halfHourBlocks}} half-hour blocks — each one could be exercise, learning, or real rest.",
          },
          {
            when: "true",
            textTemplate:
              "Halving your daily minutes saves {{calcs.hoursPerYear|decimal1}} hours annually — start with app limits, not cold turkey.",
          },
        ],
        fallbackComparison:
          "Small daily scrolls compound — even 30 minutes/day is 180+ hours per year.",
      },
    ],
  },

  guidance: [
    {
      title: "How to find your number",
      body: "Most phones break down social apps in Screen Time (iPhone) or Digital Wellbeing (Android). Add every social category together.",
      list: [
        "Include: Instagram, TikTok, X, Facebook, Snapchat, Reddit, YouTube (if passive)",
        "Exclude: messaging used for real conversations (optional)",
        "Use a 7-day average, not your best day",
      ],
    },
  ],

  ctas: {
    app: {
      title: "Reclaim scroll time automatically",
      description:
        "Reset sets daily limits on social apps and blocks feeds during focus hours — so you choose when to scroll, not your thumb.",
    },
  },

  faq: [
    {
      question: "How is this different from the Instagram calculator?",
      answer:
        "The Instagram tool isolates one app. This calculator totals all social platforms — useful if you split time across TikTok, X, and others.",
    },
    {
      question: "Should I include YouTube?",
      answer:
        "Include YouTube if you use it like social (shorts, recommendations, passive watching). Skip it if you only watch intentional long-form content.",
    },
    {
      question: "What's a healthy daily amount?",
      answer:
        "There's no universal target — but if social time exceeds 60–90 minutes daily and you feel behind on goals, the number is worth reducing.",
    },
  ],

  recommendations: [],
};
