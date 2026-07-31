import { INVESTMENT_APP_CTA } from "./investment-shared";

export const savingsPathTrackerConfig = {
  schemaVersion: "1.0" as const,
  id: "savings-path-tracker",
  slug: "savings-path-tracker",
  status: "published" as const,

  seo: {
    title: "Simple Savings Path Tracker",
    metaDescription:
      "Set a savings goal and target date, then track progress on one simple line. Free visual savings tracker — stay at or above your path without spreadsheets or complicated budgets.",
    primaryKeyword: "savings goal tracker",
    secondaryKeywords: [
      "visual savings tracker",
      "simple savings plan",
      "am I on track to save",
      "savings progress chart",
      "goal savings tracker",
    ],
    searchIntent: "calculator" as const,
    canonicalPath: "/savings-path-tracker",
  },

  taxonomy: {
    category: "planning" as const,
    tags: ["savings", "goals", "tracker", "planning"],
    cluster: "savings",
    clusterRole: "pillar" as const,
  },

  content: {
    h1: "Simple Savings Path",
    intro:
      "One line from where you are today to where you want to be. Log your balance when you check in — above the line means on track, below means catch up.",
    icon: "path",
    proseTitle: "About this tracker",
    sections: [
      {
        id: "problem",
        heading: "Why most savings plans fail",
        framework: "pas",
        body: "Spreadsheets with dozens of categories, apps that guilt-trip you after one off month, and plans you stop opening because they feel like homework. The result is decision fatigue and goals that quietly drift.",
      },
      {
        id: "concept",
        heading: "The one-line method",
        framework: "concept",
        body: "This tracker draws a straight path from today's balance to your target date. Optional income markers show when money typically arrives. Your job is simple: stay at or above the line.",
      },
      {
        id: "outcome",
        heading: "What you'll get",
        framework: "outcome",
        body: "A visual chart you can read in seconds, balance check-ins that update your progress line, and a clear on-track signal — no formulas to maintain.",
        list: [
          "Target path from start date to goal date",
          "Balance updates plotted on your chart",
          "Saved locally in your browser — no signup required",
        ],
      },
    ],
    eyebrow: "Savings",
  },

  mode: "calculator" as const,
  flow: {
    type: "calculator" as const,
    engine: "savings-path" as const,
    inputs: [],
    resultTemplateId: "default",
  },

  results: {
    emptyMessage:
      "Enter your goal, target date, and starting balance — then build your path to see the chart.",
    templates: [
      {
        id: "default",
      },
    ],
  },

  guidance: [
    {
      title: "What the line means",
      body: "The solid line is the pace you need to hit your goal on time — a straight path from today's balance to your target. It is a simple break-even guide, not an investment projection.",
    },
    {
      title: "How to read your chart",
      body: "Stay at or above the line and you are on track. Dip below and you have a broad signal to save a little more before your next check-in — not a verdict on failure.",
      list: [
        "Solid line — target path",
        "Lighter dashed line — your logged balance updates",
        "Floating $ icons — optional income dates you marked",
      ],
    },
    {
      title: "Keep it simple",
      body: "Check in whenever you like — after payday, month-end, or when you move money. The point is a quick glance, not a perfect ledger.",
    },
  ],

  ctas: {
    app: INVESTMENT_APP_CTA,
  },

  faq: [
    {
      question: "What does the target path line represent?",
      answer:
        "It is the straight-line pace from your starting balance today to your goal amount on your target date. If your latest update sits on or above that line, you are on track for that date. Below the line means you would need to save a bit more to catch up.",
    },
    {
      question: "Do I have to add income dates?",
      answer:
        "No. Income markers are optional. Add them if paydays help you remember when to check in — they appear as small floating icons on the timeline.",
    },
    {
      question: "How often should I log my balance?",
      answer:
        "Whenever is useful for you — weekly, after each paycheck, or once a month. There is no right cadence. The tool is designed for quick glances, not daily accounting.",
    },
    {
      question: "Is my data saved?",
      answer:
        "In this version, your path is stored in your browser only on this device. Account saving by email is planned for later — there is no signup required to use the tracker today.",
    },
    {
      question: "How is this different from a monthly savings calculator?",
      answer:
        "Monthly calculators tell you how much to set aside each period. This tracker answers a simpler question: am I on pace right now? Use both if you want — calculators for the number, this tool for the habit.",
    },
  ],

  recommendations: [],
};
